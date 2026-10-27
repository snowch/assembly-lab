#!/usr/bin/env python3
# Copyright © 2026 Christopher Snow
"""Build-only Pi 5 verification. This does not emulate or test a Raspberry Pi."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import shutil
import struct
import subprocess
import sys
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[2]
SOURCES = ROOT / 'apps/course/public/native/pi5'
MEMBERS = ['HARDWARE-TEST.md', 'Makefile', 'boot.ld', 'boot.s', 'config.txt', 'trip_distance.s']
TOOLS = ['aarch64-linux-gnu-as', 'aarch64-linux-gnu-ld', 'aarch64-linux-gnu-objcopy',
         'aarch64-linux-gnu-objdump', 'aarch64-linux-gnu-nm', 'aarch64-linux-gnu-readelf', 'qemu-aarch64']
sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location('native_checks', ROOT / 'scripts/native/check.py')
native = importlib.util.module_from_spec(spec)
spec.loader.exec_module(native)


def run(*args, **kwargs):
    result = subprocess.run(args, text=True, capture_output=True, timeout=30, **kwargs)
    assert result.returncode == 0, (args, result.returncode, result.stdout, result.stderr)
    return result.stdout.strip()


def check(record=False):
    missing = [tool for tool in TOOLS if not shutil.which(tool)]
    if missing:
        raise SystemExit('Install binutils-aarch64-linux-gnu and qemu-user first: ' + ', '.join(missing))
    assert (SOURCES / 'trip_distance.s').read_bytes() == (SOURCES.parent / 'trip_distance.s').read_bytes(), 'Portable function must stay identical to Module 12'
    config = (SOURCES / 'config.txt').read_text()
    for setting in ['[pi5]', 'kernel=assembly-lab-pi5.img', 'kernel_address=0x200000',
                    'os_check=0', 'device_tree=', 'uart_2ndstage=1']:
        assert setting in config.splitlines(), ('Missing boot setting', setting)
    assert 'enable_rp1_uart=' not in config and 'armstub=' not in config
    with tempfile.TemporaryDirectory(prefix='al-pi5-') as tmp:
        directory = Path(tmp)
        for name in MEMBERS:
            shutil.copyfile(SOURCES / name, directory / name)
        run('make', cwd=directory)
        exe = directory / 'boot.elf'
        raw = (directory / 'assembly-lab-pi5.img').read_bytes()
        layout = native.image_layout(exe)
        symbols = native.symbols(exe)
        assert layout['sections'][0]['address'] == symbols['_start'] == 0x200000
        assert symbols['stack_top'] % 16 == 0
        assert symbols['stack_top'] - symbols['stack_bottom'] == 4096
        assert symbols['bss_start'] % 8 == symbols['bss_end'] % 8 == 0
        assert symbols['bss_end'] <= symbols['stack_bottom']
        assert symbols['bss_start'] <= symbols['result'] < symbols['bss_end']
        assert symbols['bss_start'] <= symbols['entry_el'] < symbols['bss_end']
        assert symbols['stack_top'] <= 0x300000
        contents = exe.read_bytes()
        stored = [section for section in layout['sections'] if section['fileSize']]
        origin = min(section['address'] for section in stored)
        assert origin == 0x200000
        assert len(raw) == max(section['address'] + section['fileSize'] for section in stored) - origin
        for section in stored:
            start = section['address'] - origin
            assert raw[start:start + section['fileSize']] == contents[section['fileOffset']:section['fileOffset'] + section['fileSize']]
        assert b'Assembly Lab Pi 5: trip check passed\r\n\0' in raw
        assert b'Assembly Lab Pi 5: trip check failed\r\n\0' in raw
        assert b'Assembly Lab Pi 5: entry EL\0' in raw
        disassembly = run('aarch64-linux-gnu-objdump', '-d', str(exe))
        assert 'sub\tw0, w0, w3' in disassembly
        assert 'msr\tdaifset' in disassembly and 'mrs\tx21, currentel' in disassembly.lower()
        assert 'msr\tspsel' in disassembly
        # Verify the image stores to UARTDR with a 32-bit device access.
        assert 'str\tw2, [x0]' in disassembly
        # Decode uart_init's actual LDR-literal target, not a disconnected source string.
        init_offset = symbols['uart_init'] - origin
        literal_load, = struct.unpack_from('<I', raw, init_offset)
        assert literal_load & 0xff00001f == 0x58000000, 'UART base must load into x0'
        displacement = (literal_load >> 5) & 0x7ffff
        if displacement & 0x40000:
            displacement -= 0x80000
        uart_base, = struct.unpack_from('<Q', raw, init_offset + displacement * 4)
        assert uart_base == 0x107d001000, 'Wrong Pi 5 dedicated UART physical address'
        # GNU-assembled sequence: MOV w3,5; STR w3,IBRD; STR wzr,FBRD;
        # MOV w3,0x70; STR w3,LCR_H; MOV w3,0x101; STR w3,CR.
        uart_setup = struct.pack('<7I', 0x528000a3, 0xb9002403, 0xb900281f,
                                 0x52800e03, 0xb9002c03, 0x52802023, 0xb9003003)
        assert uart_setup in raw[init_offset:symbols['uart_putc'] - origin], 'Wrong UART divisor/format/control writes'
        # The exact divisor claim is integer arithmetic, independent of firmware execution.
        assert 9_216_000 // (16 * 115_200) == 5 and 9_216_000 % (16 * 115_200) == 0
        # This Linux user-mode harness checks only portable arithmetic, NOT Pi boot/UART.
        harness = directory / 'arithmetic-check.s'
        harness.write_text('''// Copyright © 2026 Christopher Snow
.text
.global _start
_start:
    mov w0, #120
    mov w1, #85
    mov w2, #42
    mov w3, #15
    bl trip_distance
    cmp w0, #232
    cset w0, ne
    mov x8, #93
    svc #0
.section .note.GNU-stack,"",%progbits
''')
        run('aarch64-linux-gnu-as', str(harness), '-o', str(directory / 'arithmetic.o'))
        for name, expected_exit in [('original', 0), ('broken', 1)]:
            source = (SOURCES / 'trip_distance.s').read_text()
            if name == 'broken':
                source = source.replace('sub w0, w0, w3', 'add w0, w0, w3')
            variant = directory / (name + '.s')
            variant.write_text(source)
            obj = directory / (name + '.o')
            run('aarch64-linux-gnu-as', str(variant), '-o', str(obj))
            target = directory / name
            run('aarch64-linux-gnu-ld', '-e', '_start', str(directory / 'arithmetic.o'), str(obj), '-o', str(target))
            tested = subprocess.run(['qemu-aarch64', str(target)], capture_output=True, timeout=10)
            assert tested.returncode == expected_exit, ('Arithmetic-only QEMU check', name, tested.returncode)
        run('make', 'card-files', cwd=directory)
        assert {p.name for p in (directory / 'card-files').iterdir()} == {'config.txt', 'assembly-lab-pi5.img', 'SHA256SUMS'}
        run('sha256sum', '--check', 'SHA256SUMS', cwd=directory / 'card-files')
        observed = {
            'verification': 'Build and file-layout checks only; no Pi 5 hardware or firmware execution.',
            'loadAddress': origin,
            'rawSize': len(raw),
            'rawSha256': hashlib.sha256(raw).hexdigest(),
            'sections': [{key: s[key] for key in ['name', 'address', 'size', 'fileSize']} for s in layout['sections']],
            'uartAddress': uart_base,
            'uartClockHz': 9_216_000,
            'baud': 115_200,
            'integerDivisor': 5,
            'fractionalDivisor': 0,
            'cardFiles': ['config.txt', 'assembly-lab-pi5.img'],
            'arithmeticOnlyQemu': {'originalExit': 0, 'brokenExit': 1},
        }
        evidence_path = SOURCES / 'build-evidence.json'
        archive_path = SOURCES / 'assembly-lab-pi5.zip'
        expected = {f'assembly-lab-pi5/{name}': (SOURCES / name).read_bytes() for name in MEMBERS}
        if record:
            evidence = {**observed, 'versions': {tool: run(tool, '--version').splitlines()[0] for tool in TOOLS}}
            evidence_path.write_text(json.dumps(evidence, indent=2) + '\n')
            with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as archive:
                for name, data in expected.items():
                    info = zipfile.ZipInfo(name, (2026, 1, 1, 0, 0, 0))
                    info.external_attr = 0o644 << 16
                    archive.writestr(info, data, compress_type=zipfile.ZIP_DEFLATED)
        else:
            saved = json.loads(evidence_path.read_text())
            for key, value in observed.items():
                assert saved[key] == value, ('Stale Pi 5 build evidence', key)
            with zipfile.ZipFile(archive_path) as archive:
                assert set(archive.namelist()) == set(expected), 'Stale Pi 5 source bundle members'
                for name, data in expected.items():
                    assert archive.read(name) == data, ('Stale Pi 5 source bundle', name)
    print('Pi 5 build checks passed: GNU assembly/link/raw image, entry/load address, BSS/stack layout, portable function, UART constants, good/broken arithmetic-only QEMU calls and source bundle. Physical boot and serial output NOT tested.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--record', action='store_true')
    check(parser.parse_args().record)
