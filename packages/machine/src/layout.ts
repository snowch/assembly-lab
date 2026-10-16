// Copyright © 2026 Christopher Snow

// The course's fixed addresses (docs/machine.md, "Programs and runs"). A figure's addresses are the
// addresses a real run under QEMU has, because the differential test links at these.

/** Text starts here. */
export const TEXT_BASE = 0x400000;
/** Data, read-only data and zero-filled data start here, in that order. */
export const DATA_BASE = 0x410000;
/** The stack is a 64 KiB region starting here. */
export const STACK_BASE = 0x420000;
/** The top of the stack: where `sp` starts. */
export const STACK_TOP = 0x430000;
/**
 * Where a call returns to, unless the call says otherwise. Outside every region, so a `ret` that
 * reaches it ends the run.
 */
export const RETURN_ADDRESS = 0x440000;
/** The step limit when a call does not give one. */
export const DEFAULT_STEP_LIMIT = 10_000;
