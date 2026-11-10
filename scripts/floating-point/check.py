#!/usr/bin/env python3
# Copyright © 2026 Christopher Snow
"""Assemble unmodified recorded GCC instructions and verify exact A64/QEMU results.

--record refreshes the execution evidence and generated TypeScript data. This never
calls Compiler Explorer: the original public-API requests and responses are retained.
"""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import struct
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[2]
RECORDS = ROOT / 'docs/notes/floating-point'
COMPILER = RECORDS / 'compiler'
EVIDENCE = RECORDS / 'native.evidence.json'
MODULE = ROOT / 'content/lessons/floating-point.native.ts'
TOOLS = ['aarch64-linux-gnu-as', 'aarch64-linux-gnu-ld', 'aarch64-linux-gnu-objdump', 'qemu-aarch64']
# These are raw input encodings, not host arithmetic results.
CASES = [
    ('add32-exact', 'route_distance', 'add', 'float', [('distance', 32, '0x41180000'), ('detour', 32, '0x3fa00000')], 32),
    ('add32-rounding', 'route_distance', 'add', 'float', [('distance', 32, '0x4b800000'), ('detour', 32, '0x3f800000')], 32),
    ('add64-exact', 'route_distance64', 'add', 'float', [('distance', 64, '0x4170000000000000'), ('detour', 64, '0x3ff0000000000000')], 64),
    ('mul32-exact', 'fuel_cost', 'multiply', 'float', [('litres', 32, '0x41480000'), ('price', 32, '0x3fc00000')], 32),
    ('int32-to-float', 'distance_as_float', 'int-to-float', 'float', [('distance', 32, '0x01000001')], 32),
    ('float-to-int-positive', 'whole_distance', 'float-to-int', 'int', [('distance', 32, '0x411c0000')], 32),
    ('float-to-int-negative', 'whole_distance', 'float-to-int', 'int', [('distance', 32, '0xc11c0000')], 32),
    ('widen-float', 'widen_distance', 'widen', 'float', [('distance', 32, '0x4145999a')], 64),
    ('copy-float-bits', 'float_pattern', 'copy-bits', 'bits', [('distance', 32, '0x41180000')], 32),
]


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def run(args, **kwargs):
    result = subprocess.run(args, capture_output=True, timeout=40, **kwargs)
    if result.returncode:
        raise RuntimeError(f'{args}: exit {result.returncode}\n{result.stderr.decode(errors="replace")}')
    return result.stdout


def records():
    metadata = json.loads((COMPILER / 'compiler.json').read_text())
    assert metadata['id'] == 'carm64g1610' and metadata['semver'] == '16.1.0'
    programs = {}
    sources = {}
    for function in dict.fromkeys(case[1] for case in CASES):
        source = (COMPILER / f'{function}.c').read_text()
        request = json.loads((COMPILER / f'{function}.request.json').read_text())
        response = json.loads((COMPILER / f'{function}.response.json').read_text())
        assert request['source'] == source
        assert request['options']['userArguments'] == '-O1'
        assert response['code'] == 0 and not response['truncated'] and not response['timedOut']
        assert response['instructionSet'] == 'aarch64'
        assert '-O1' in response['compilationOptions']
        raw = response['asm']
        instructions = [row for row in raw if row.get('source') is not None]
        assert len(instructions) == 2 and instructions[-1]['text'].strip() == 'ret'
        assert all(1 <= row['source']['line'] <= len(source.splitlines()) for row in instructions)
        # Keep compiler line references exactly; checked associations use the C pane's numbering.
        listing = '\n'.join(row['text'] + (f" C{row['source']['line']}" if row.get('source') else '') for row in raw)
        checked_lines = [[4], [5]] if function == 'float_pattern' else [[3], [3]]
        programs[function] = {'c': '\n'.join(source.splitlines()[1:]), 'listing': listing,
                              'sourceLines': checked_lines}
        sources[function] = {'sha256': sha256(source.encode()),
                             'requestSha256': sha256((COMPILER / f'{function}.request.json').read_bytes()),
                             'responseSha256': sha256((COMPILER / f'{function}.response.json').read_bytes()),
                             'assembly': '\n'.join(row['text'] for row in raw) + '\n'}
    return metadata, programs, sources


def harness(sources):
    text = ['// Copyright © 2026 Christopher Snow', '.text', '.global _start', '_start:',
            '  msr fpcr, xzr', '  msr fpsr, xzr', '  isb',
            '  adr x20, results', '  mrs x9, fpcr', '  str x9, [x20], #8']
    data = ['.data', '.balign 8']
    for index, (_, function, _, result_type, inputs, width) in enumerate(CASES):
        text += ['  msr fpsr, xzr']
        for arg, (_, input_width, bits) in enumerate(inputs):
            label = f'input_{index}_{arg}'
            data += [f'{label}:', f'  {".word" if input_width == 32 else ".quad"} {bits}']
            register = ('w0' if function == 'distance_as_float' else f'{"s" if input_width == 32 else "d"}{arg}')
            text += [f'  adr x9, {label}', f'  ldr {register}, [x9]']
        text += [f'  bl {function}']
        if result_type == 'float':
            text += [f'  fmov {"w0, s0" if width == 32 else "x0, d0"}']
        text += [f'  str {"w0" if width == 32 else "x0"}, [x20], #{width // 8}']
    size = 8 + sum(case[-1] // 8 for case in CASES)
    text += ['  mov x0, #1', '  adr x1, results', f'  mov x2, #{size}', '  mov x8, #64', '  svc #0',
             '  cmp x0, x2', '  cset x0, ne', '  mov x8, #93', '  svc #0']
    text += [value['assembly'] for value in sources.values()]
    text += data + ['.bss', '.balign 8', 'results:', f'  .skip {size}']
    return '\n'.join(text) + '\n'


def module():
    return """// Copyright © 2026 Christopher Snow
// Generated by scripts/floating-point/check.py --record from retained GCC/QEMU evidence.
// A recording is data for inspection; it does not extend the browser instruction set.
import evidence from "../../docs/notes/floating-point/native.evidence.json" with { type: "json" };

export interface FpNativeCase {
  readonly id: string;
  readonly operation: "add" | "multiply" | "int-to-float" | "float-to-int" | "widen" | "copy-bits";
  readonly resultType: "float" | "int" | "bits";
  readonly inputs: readonly {
    readonly name: string;
    readonly width: 32 | 64;
    readonly hex: string;
  }[];
  readonly result: { readonly width: 32 | 64; readonly hex: string };
  readonly program: {
    readonly c: string;
    readonly listing: string;
    readonly sourceLines: readonly (readonly number[])[];
  };
  readonly machine: {
    readonly architecture: "aarch64";
    readonly compilerId: "carm64g1610";
    readonly compilerVersion: "16.1.0";
    readonly options: "-O1";
    readonly fpcr: "0x00000000";
  };
}

// The required native checker verifies the imported records before CI can pass.
export const FP_NATIVE_CASES: readonly FpNativeCase[] = evidence.cases as readonly FpNativeCase[];
"""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--record', action='store_true')
    args = parser.parse_args()
    missing = [tool for tool in TOOLS if shutil.which(tool) is None]
    if missing:
        parser.exit(1, 'Required native FP tools missing: ' + ', '.join(missing) + '\n')
    metadata, programs, sources = records()
    assembly = harness(sources)
    with tempfile.TemporaryDirectory(prefix='assembly-lab-fp-') as directory:
        temporary = Path(directory)
        source, obj, exe = [temporary / name for name in ['native.s', 'native.o', 'native.elf']]
        source.write_text(assembly)
        run(['aarch64-linux-gnu-as', str(source), '-o', str(obj)])
        run(['aarch64-linux-gnu-ld', str(obj), '-o', str(exe)])
        disassembly = run(['aarch64-linux-gnu-objdump', '-d', str(exe)]).decode()
        output = run(['qemu-aarch64', '-cpu', 'cortex-a53', str(exe)])
    assert len(output) == 8 + sum(case[-1] // 8 for case in CASES)
    assert struct.unpack_from('<Q', output)[0] == 0, 'FPCR was not zero'
    cases = []
    offset = 8
    for case_id, function, operation, result_type, inputs, width in CASES:
        value = int.from_bytes(output[offset:offset + width // 8], 'little')
        offset += width // 8
        cases.append({'id': case_id, 'operation': operation, 'resultType': result_type,
                      'inputs': [{'name': name, 'width': bits, 'hex': hex_value} for name, bits, hex_value in inputs],
                      'result': {'width': width, 'hex': f'0x{value:0{width // 4}x}'},
                      'program': programs[function],
                      'machine': {'architecture': 'aarch64', 'compilerId': metadata['id'],
                                  'compilerVersion': metadata['semver'], 'options': '-O1', 'fpcr': '0x00000000'}})
    checked = {'compiler': metadata, 'sources': sources, 'harnessSha256': sha256(assembly.encode()),
               'outputLittleEndianHex': output.hex(), 'cases': cases}
    if args.record:
        evidence = {**checked, 'recordedAt': '2026-11-10',
                    'tools': {tool: run([tool, '--version']).decode().splitlines()[0] for tool in TOOLS},
                    'execution': {'cpu': 'cortex-a53', 'system': 'Linux user mode', 'fpcr': '0x00000000',
                                  'command': 'qemu-aarch64 -cpu cortex-a53 native.elf'},
                    'disassembly': disassembly.replace(str(exe), 'native.elf')}
        EVIDENCE.write_text(json.dumps(evidence, indent=2, ensure_ascii=False) + '\n')
        MODULE.write_text(module())
    else:
        evidence = json.loads(EVIDENCE.read_text())
        for key, value in checked.items():
            assert evidence[key] == value, f'Recorded native FP evidence changed: {key}'
        assert MODULE.read_text() == module(), 'Generated native TypeScript differs from measured evidence'
    print(f'Native FP: {len(sources)} unchanged GCC functions, {len(cases)} exact-bit QEMU results, FPCR=0; passed')


if __name__ == '__main__':
    main()
