#!/usr/bin/env python3
# Copyright © 2026 Christopher Snow
"""Check the actual assembly-only boot images; --record refreshes their evidence and bundle."""
import argparse
import json
import os
from pathlib import Path
import re
import select
import shutil
import socket
import subprocess
import tempfile
import time
import zipfile

ROOT = Path(__file__).resolve().parents[2]
SOURCES = ROOT / 'apps/course/public/native'
TOOLS = ['aarch64-linux-gnu-as', 'aarch64-linux-gnu-ld', 'aarch64-linux-gnu-nm',
         'aarch64-linux-gnu-readelf', 'aarch64-linux-gnu-objdump', 'qemu-aarch64',
         'gdb-multiarch', 'qemu-system-aarch64', 'file']
QEMU = ['qemu-system-aarch64', '-M', 'virt', '-cpu', 'cortex-a53', '-m', '128M', '-nographic']
PASSED = 'Assembly Lab: trip check passed'
FAILED = 'Assembly Lab: trip check failed'


def run(*args, expected=0, **kwargs):
    result = subprocess.run(args, text=True, capture_output=True, timeout=40, **kwargs)
    assert result.returncode == expected, (args, result.returncode, result.stdout, result.stderr)
    return result.stdout.strip()


def build(directory, source, name, harness='boot.s'):
    asm = directory / (name + '-trip.s')
    asm.write_text(source)
    obj = directory / (name + '-trip.o')
    boot_obj = directory / (name + '-boot.o')
    run('aarch64-linux-gnu-as', '-g', str(asm), '-o', str(obj))
    run('aarch64-linux-gnu-as', '-g', '-I', str(SOURCES), str(SOURCES / harness), '-o', str(boot_obj))
    exe = directory / (name + '.elf')
    run('aarch64-linux-gnu-ld', '-T', str(SOURCES / 'boot.ld'), str(boot_obj), str(obj), '-o', str(exe))
    return exe


def symbols(exe):
    output = run('aarch64-linux-gnu-nm', '-n', str(exe))
    return {name: int(address, 16) for address, name in re.findall(r'^([0-9a-f]+) \w (\w+)$', output, re.M)}


def read_serial(process, expected):
    data = b''
    deadline = time.monotonic() + 15
    while (expected + '\n').encode() not in data and time.monotonic() < deadline:
        ready, _, _ = select.select([process.stdout], [], [], 0.25)
        if ready:
            chunk = os.read(process.stdout.fileno(), 4096)
            if not chunk:
                break
            data += chunk
    assert (expected + '\n').encode() in data, (expected, data)
    # Exiting the emulator is a host command, not a guest process exit.
    _, errors = process.communicate(b'\x01x', timeout=10)
    assert process.returncode == 0, errors
    return expected


def stop(process):
    if process.poll() is None:
        process.kill()
        process.wait()


def uart_run(exe, expected):
    process = subprocess.Popen([*QEMU, '-kernel', str(exe)], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    try:
        return read_serial(process, expected)
    finally:
        stop(process)


def debug(exe, expected):
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        port = sock.getsockname()[1]
    process = subprocess.Popen([*QEMU, '-kernel', str(exe), '-S', '-gdb', f'tcp:127.0.0.1:{port}'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    try:
        boot_row = 'printf "ALBOOT %lu %lu %lu\\n", $pc, $sp, *(unsigned int*)&result'
        commands = ['set pagination off', 'set confirm off', 'set tcp auto-retry on',
                    'set remotetimeout 10', f'target remote localhost:{port}',
                    'printf "ALRESET %lu %lu\\n", $pc, $cpsr', 'x/6i $pc',
                    'set {unsigned int}&result = 0xa5a5a5a5', boot_row,
                    'tbreak boot_ready', 'continue', boot_row,
                    'printf "ALDATA %u\\n", *(unsigned int*)&initialized_marker',
                    'break trip_distance', 'continue']
        for index in range(5):
            if index:
                commands.append('stepi')
            commands.append('printf "ALSTATE %lu %lu %lu %lu %ld\\n", $x0 & 0xffffffff, $x1 & 0xffffffff, $x2 & 0xffffffff, $x3 & 0xffffffff, $pc - (long)&trip_distance')
        commands += ['info symbol $pc', 'tbreak halt', 'continue', boot_row, 'detach']
        output = run('gdb-multiarch', '-q', '-batch', str(exe), *[v for c in commands for v in ['-ex', c]])
        rows = [[int(n) for n in match] for match in re.findall(r'ALSTATE (\d+) (\d+) (\d+) (\d+) (-?\d+)', output)]
        boots = [[int(n) for n in match] for match in re.findall(r'ALBOOT (\d+) (\d+) (\d+)', output)]
        reset = re.search(r'ALRESET (\d+) (\d+)', output)
        assert reset and len(rows) == 5 and len(boots) == 3, output
        assert [row[4] for row in rows[:4]] == [0, 4, 8, 12], output
        sym = symbols(exe)
        assert rows[-1][4] == sym['after_trip'] - sym['trip_distance'], output
        assert int(reset[1]) == sym['_start'], output
        assert int(reset[2]) & 0xf == 5, output  # this configured machine starts at EL1h
        assert boots[0] == [sym['_start'], 0, 0xa5a5a5a5], output
        assert boots[1] == [sym['boot_ready'], sym['stack_top'], 0], output
        assert boots[2] == [sym['halt'], sym['stack_top'], rows[-1][0]], output
        assert sym['stack_top'] % 16 == 0 and sym['stack_top'] - sym['stack_bottom'] == 4096
        assert 'ALDATA 305419896' in output, output
        stdout = read_serial(process, expected)
        trace = {'registers': [r[:4] for r in rows], 'pcOffsets': [r[4] for r in rows[:4]], 'returnTo': 'after_trip'}
        boot = {'entry': sym['_start'], 'resetPc': int(reset[1]), 'resetCpsr': int(reset[2]),
                'ramStart': 0x40000000, 'ramEnd': 0x48000000,
                'bssStart': sym['bss_start'], 'bssEnd': sym['bss_end'],
                'stackBottom': sym['stack_bottom'], 'stackTop': sym['stack_top'],
                'initializedMarker': 0x12345678,
                'startupStops': [{'pc': pc, 'sp': sp, 'result': result} for pc, sp, result in boots],
                'regions': [{'kind': 'code', 'start': sym['text_start'], 'end': sym['text_end']},
                            {'kind': 'bss', 'start': sym['bss_start'], 'end': sym['bss_end']},
                            {'kind': 'stack', 'start': sym['stack_bottom'], 'end': sym['stack_top']},
                            {'kind': 'uart', 'start': 0x09000000, 'end': 0x09001000}]}
        return trace, boot, stdout
    finally:
        stop(process)


def check(record=False):
    missing = [tool for tool in TOOLS if not shutil.which(tool)]
    if missing:
        raise SystemExit('Install native lesson tools first: ' + ', '.join(missing))
    original = (SOURCES / 'trip_distance.s').read_text()
    broken = original.replace('sub w0, w0, w3', 'add w0, w0, w3')
    twice = original.replace('    sub w0, w0, w3', '    sub w0, w0, w3\n    sub w0, w0, w3')
    alternative = original.replace('    sub w0, w0, w3', '    add w3, w3, w3\n    sub w0, w0, w3')
    with tempfile.TemporaryDirectory(prefix='al-native-') as tmp:
        directory = Path(tmp)
        trip = build(directory, original, 'boot')
        bad = build(directory, broken, 'broken')
        good_trace, boot, stdout = debug(trip, PASSED)
        bad_trace, bad_boot, bad_stdout = debug(bad, FAILED)
        assert good_trace['registers'] == [[120,85,42,15],[205,85,42,15],[247,85,42,15],[232,85,42,15],[232,85,42,15]]
        assert bad_trace['registers'][:3] == good_trace['registers'][:3]
        assert bad_trace['registers'][3:] == [[262,85,42,15],[262,85,42,15]]
        assert boot['startupStops'][-1]['result'] == 232 and bad_boot['startupStops'][-1]['result'] == 262
        header = run('aarch64-linux-gnu-readelf', '-h', '-l', str(trip))
        assert 'AArch64' in header and 'little endian' in header and 'EXEC' in header and 'INTERP' not in header, header
        assert 'Entry point address:               0x40080000' in header, header
        segments = re.findall(r'LOAD\s+0x[0-9a-f]+\s+0x([0-9a-f]+)\s+0x([0-9a-f]+)\s+0x([0-9a-f]+)\s+0x([0-9a-f]+)', header)
        assert len(segments) == 2, header
        for _, physical, _, memory_size in segments:
            assert 0x40000000 <= int(physical, 16) < 0x48000000
            assert int(physical, 16) + int(memory_size, 16) <= 0x48000000
        assert int(segments[1][3], 16) > int(segments[1][2], 16), header
        description = run('file', str(trip)).split(': ', 1)[1]
        disassembly = run('aarch64-linux-gnu-objdump', '-d', '--disassemble=trip_distance', str(trip))
        assert 'sub\tw0, w0, w3' in disassembly and 'ret' in disassembly
        for name, source in [('twice', twice), ('alternative', alternative)]:
            challenge = build(directory, source, name, 'verify-boot.s')
            assert uart_run(challenge, '4 cases passed') == '4 cases passed'
        failing = build(directory, original, 'unchanged', 'verify-boot.s')
        uart_run(failing, FAILED)
        standalone_obj = directory / 'standalone.o'
        standalone_exe = directory / 'standalone'
        run('aarch64-linux-gnu-as', '-g', str(SOURCES / 'standalone.s'), '-o', str(standalone_obj))
        run('aarch64-linux-gnu-ld', '-e', '_start', str(standalone_obj), '-o', str(standalone_exe))
        standalone = run('qemu-aarch64', str(standalone_exe))
        assert standalone == 'Assembly Lab: native ARM64'
        evidence = {'environment': 'Ubuntu 24.04, x86_64 host',
                    'versions': {tool: run(tool, '--version').splitlines()[0] for tool in TOOLS if tool != 'file'},
                    'file': description, 'stdout': stdout, 'brokenStdout': bad_stdout,
                    'good': good_trace, 'broken': bad_trace, 'boot': boot,
                    'standalone': standalone, 'bareMetal': stdout, 'challenge': '4 cases passed'}
        if record:
            (ROOT / 'content/lessons/module-12.evidence.json').write_text(json.dumps(evidence, indent=2) + '\n')
            with zipfile.ZipFile(SOURCES / 'assembly-lab-native.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
                for source in sorted(SOURCES.iterdir()):
                    if source.suffix not in ['.s', '.c', '.ld'] and source.name != 'Makefile':
                        continue
                    info = zipfile.ZipInfo(source.name, (2026, 1, 1, 0, 0, 0))
                    info.external_attr = 0o644 << 16
                    archive.writestr(info, source.read_bytes(), compress_type=zipfile.ZIP_DEFLATED)
        else:
            saved = json.loads((ROOT / 'content/lessons/module-12.evidence.json').read_text())
            for key in ['stdout', 'brokenStdout', 'good', 'broken', 'boot', 'standalone', 'bareMetal', 'challenge']:
                assert evidence[key] == saved[key], ('Stale native evidence', key)
            with zipfile.ZipFile(SOURCES / 'assembly-lab-native.zip') as archive:
                expected = {source.name: source.read_bytes() for source in SOURCES.iterdir()
                            if source.suffix in ['.s', '.c', '.ld'] or source.name == 'Makefile'}
                assert set(archive.namelist()) == set(expected), 'Stale source bundle members'
                for name, contents in expected.items():
                    assert archive.read(name) == contents, ('Stale source bundle', name)
        print('Native checks passed: assembly-only ELF boot, startup/BSS/stack, good/broken system GDB traces, two native challenge solutions, rejection of original, UART/console exit and optional Linux assembly.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--record', action='store_true')
    check(parser.parse_args().record)
