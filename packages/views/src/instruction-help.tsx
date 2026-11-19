// Copyright © 2026 Christopher Snow

import { createContext, useContext, type ReactNode } from "react";

/** Only public instruction/exercise identifiers cross into the shell's reference tool. */
export interface InstructionHelpRequest {
  readonly mnemonic?: string;
  readonly challengeId?: string;
}

export interface InstructionHelpApi {
  readonly open: (request: InstructionHelpRequest) => void;
  readonly rememberChallenge: (id: string) => void;
}

const InstructionHelpContext = createContext<InstructionHelpApi | null>(null);

export function InstructionHelpProvider({
  value,
  children,
}: {
  value: InstructionHelpApi;
  children: ReactNode;
}) {
  return (
    <InstructionHelpContext.Provider value={value}>{children}</InstructionHelpContext.Provider>
  );
}

/** Views used outside the course shell keep their existing behaviour. */
export const useInstructionHelp = () => useContext(InstructionHelpContext);
