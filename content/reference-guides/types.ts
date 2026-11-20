// Copyright © 2026 Christopher Snow

export type ReferenceWatch =
  | {
      readonly kind: "register";
      readonly name: string;
      readonly reading?: "signed" | "unsigned" | "hex";
    }
  | {
      readonly kind: "memory";
      readonly symbol: string;
      readonly bytes: number;
      readonly reading?: "signed" | "unsigned" | "hex";
    }
  | { readonly kind: "address"; readonly symbol: string }
  | { readonly kind: "flags" }
  | { readonly kind: "pc" };

export interface ExplainedReferenceExample {
  readonly id: string;
  /** Preparation runs before the one displayed instruction. Do not use x28 (saved return). */
  readonly setup?: string;
  readonly instruction: string;
  /** Optional branch targets/helper code after the displayed instruction and before cleanup. */
  readonly continuation?: string;
  /** Optional data section, with local .L labels. */
  readonly data?: string;
  readonly watch: readonly ReferenceWatch[];
  readonly explanation: string;
}
export interface ReferenceMistake {
  readonly source: string;
  readonly explanation: string;
  readonly errorKey: string;
}
export interface InstructionFormGuide {
  readonly id: string;
  readonly title: string;
  readonly syntax: readonly string[];
  readonly rules: readonly string[];
  readonly advancedRules?: readonly string[];
  readonly advanced?: boolean;
  readonly examples: readonly ExplainedReferenceExample[];
  readonly mistakes?: readonly ReferenceMistake[];
}
export type ReferenceGuideFamily = Readonly<Record<string, readonly InstructionFormGuide[]>>;
