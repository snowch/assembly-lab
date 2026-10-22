#!/usr/bin/env python3
# Copyright © 2026 Christopher Snow
"""Execute the native lesson assets; --record refreshes checked evidence and the download."""
import argparse
import json
import os
from pathlib import Path
import re
import shutil
import socket
import subprocess
import tempfile
import time
import zipfile

ROOT = Path(__file__).resolve().parents[2]
SOURCES = ROOT / 'apps/course/public/native'
TOOLS = ['aarch64-linux-gnu-gcc', 'aarch64-linux-gnu-as', 'aarch64-linux-gnu-ld',
         'aarch64-linux-gnu-readelf', 'aarch64-linux-gnu-objdump', 'qemu-aarch64',
         'gdb-multiarch', 'qemu-system-aarch64', 'file']

def run(*args, expected=0, **kwargs):
    result = subprocess.run(args, text=True, capture_output=True, timeout=40, **kwargs)
    assert result.returncode == expected, (args, result.returncode, result.stdout, result.stderr)
    return result.stdout.strip()

def compile_trip(directory, source, name, harness='main.c'):
    path = directory / (name + '.s')
    path.write_text(source)
    exe = directory / name
    main_obj = directory / (name + '-main.o')
    asm_obj = directory / (name + '-asm.o')
    run('aarch64-linux-gnu-gcc', '-g', '-O0', '-c', str(SOURCES / harness), '-o', str(main_obj))
    run('aarch64-linux-gnu-as', '-g', str(path), '-o', str(asm_obj))
    run('aarch64-linux-gnu-gcc', '-static', '-g', '-no-pie', str(main_obj), str(asm_obj), '-o', str(exe))
    return exe

def debug(exe):
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        port = sock.getsockname()[1]
    process = subprocess.Popen(['qemu-aarch64', '-g', str(port), str(exe)], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    try:
        commands = ['set pagination off', 'set confirm off', 'set tcp auto-retry on',
                    'set remotetimeout 10', f'target remote localhost:{port}',
                    'break trip_distance', 'continue']
        for index in range(5):
            if index:
                commands.append('stepi')
            commands.append('printf "ALSTATE %lu %lu %lu %lu %ld\\n", $x0 & 0xffffffff, $x1 & 0xffffffff, $x2 & 0xffffffff, $x3 & 0xffffffff, $pc - (long)&trip_distance')
        commands += ['info symbol $pc', 'continue']
        output = run('gdb-multiarch', '-q', '-batch', str(exe), *[v for c in commands for v in ['-ex', c]])
        rows = [[int(n) for n in match] for match in re.findall(r'ALSTATE (\d+) (\d+) (\d+) (\d+) (-?\d+)', output)]
        assert len(rows) == 5, output
        assert [row[4] for row in rows[:4]] == [0, 4, 8, 12], output
        assert re.search(r'main \+ \d+', output), output
        stdout, stderr = process.communicate(timeout=10)
        assert not stderr, stderr
        return {'registers': [r[:4] for r in rows], 'pcOffsets': [r[4] for r in rows[:4]], 'returnTo': 'main'}, stdout.strip(), process.returncode
    finally:
        if process.poll() is None:
            process.kill()
            process.wait()

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
        trip = compile_trip(directory, original, 'trip')
        bad = compile_trip(directory, broken, 'broken')
        good_trace, stdout, code = debug(trip)
        bad_trace, bad_stdout, bad_code = debug(bad)
        assert stdout == 'trip_distance(120, 85, 42, 15) = 232' and code == 0
        assert bad_stdout == 'trip_distance(120, 85, 42, 15) = 262' and bad_code == 1
        assert good_trace['registers'] == [[120,85,42,15],[205,85,42,15],[247,85,42,15],[232,85,42,15],[232,85,42,15]]
        assert bad_trace['registers'][:3] == good_trace['registers'][:3]
        assert bad_trace['registers'][3:] == [[262,85,42,15],[262,85,42,15]]
        elf = run('aarch64-linux-gnu-readelf', '-h', str(trip))
        assert 'AArch64' in elf and 'EXEC' in elf
        description = run('file', str(trip)).split(': ', 1)[1]
        assert 'statically linked' in description
        disassembly = run('aarch64-linux-gnu-objdump', '-d', '--disassemble=trip_distance', str(trip))
        assert 'sub\tw0, w0, w3' in disassembly and 'ret' in disassembly
        for name, source in [('twice', twice), ('alternative', alternative)]:
            challenge = compile_trip(directory, source, name, 'verify-challenge.c')
            assert run('qemu-aarch64', str(challenge)) == '4 cases passed'
        failing = compile_trip(directory, original, 'unchanged', 'verify-challenge.c')
        run('qemu-aarch64', str(failing), expected=1)
        for name in ['standalone', 'boot']:
            obj = directory / (name + '.o')
            run('aarch64-linux-gnu-as', '-g', str(SOURCES / (name + '.s')), '-o', str(obj))
            args = ['-T', str(SOURCES / 'boot.ld')] if name == 'boot' else ['-e', '_start']
            exe = directory / name
            run('aarch64-linux-gnu-ld', *args, str(obj), '-o', str(exe))
            header = run('aarch64-linux-gnu-readelf', '-h', '-l', str(exe))
            assert 'AArch64' in header and 'little endian' in header and 'EXEC' in header, header
            assert 'INTERP' not in header, header
            if name == 'boot':
                assert 'Entry point address:               0x40080000' in header, header
                segments = re.findall(r'LOAD\s+0x[0-9a-f]+\s+0x([0-9a-f]+)\s+0x([0-9a-f]+)\s+0x([0-9a-f]+)\s+0x([0-9a-f]+)', header)
                assert segments, header
                for virtual, physical, size, memory_size in segments:
                    assert 0x40000000 <= int(physical, 16) < 0x48000000
                    assert int(physical, 16) + int(memory_size, 16) <= 0x48000000
        standalone = run('qemu-aarch64', str(directory / 'standalone'))
        assert standalone == 'Assembly Lab: native ARM64'
        process = subprocess.Popen(['qemu-system-aarch64', '-M', 'virt', '-cpu', 'cortex-a53', '-m', '128M', '-nographic', '-kernel', str(directory / 'boot')], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        try:
            # UART output is asynchronous. Read with a deadline, then exercise the documented console escape.
            import select
            data = b''
            deadline = time.monotonic() + 20
            while b'Assembly Lab: bare metal\n' not in data and time.monotonic() < deadline:
                ready, _, _ = select.select([process.stdout], [], [], 0.5)
                if ready:
                    data += os.read(process.stdout.fileno(), 4096)
            assert b'Assembly Lab: bare metal\n' in data, (data, process.stderr.read() if process.poll() is not None else b'UART deadline')
            tail, errors = process.communicate(b'\x01x', timeout=10)
            assert process.returncode == 0, errors
        finally:
            if process.poll() is None:
                process.kill()
                process.wait()
        evidence = {'environment': 'Ubuntu 24.04, x86_64 host',
                    'versions': {tool: run(tool, '--version').splitlines()[0] for tool in TOOLS if tool != 'file'},
                    'file': description, 'stdout': stdout, 'exitCode': code,
                    'brokenStdout': bad_stdout, 'brokenExitCode': bad_code,
                    'good': good_trace, 'broken': bad_trace,
                    'standalone': standalone, 'bareMetal': 'Assembly Lab: bare metal',
                    'challenge': '4 cases passed'}
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
            for key in ['stdout', 'exitCode', 'brokenStdout', 'brokenExitCode', 'good', 'broken', 'standalone', 'bareMetal', 'challenge']:
                assert evidence[key] == saved[key], ('Stale native evidence', key)
            with zipfile.ZipFile(SOURCES / 'assembly-lab-native.zip') as archive:
                expected = {source.name: source.read_bytes() for source in SOURCES.iterdir()
                            if source.suffix in ['.s', '.c', '.ld'] or source.name == 'Makefile'}
                assert set(archive.namelist()) == set(expected), 'Stale source bundle members'
                for name, contents in expected.items():
                    assert archive.read(name) == contents, ('Stale source bundle', name)
        print('Native checks passed: ELF, good/broken GDB traces, two challenge solutions, standalone Linux, optional UART and console exit.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--record', action='store_true')
    check(parser.parse_args().record)
