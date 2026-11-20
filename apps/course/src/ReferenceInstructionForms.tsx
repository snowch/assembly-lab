// Copyright © 2026 Christopher Snow

import { Fragment, useMemo, useState } from "react";
import {
  INSTRUCTION_FORM_GUIDES,
  computeReferenceExample,
  buildReferenceExample,
} from "@al/content";
import type { ExplainedReferenceExample, InstructionFormGuide } from "@al/content";
import { REFERENCE_EXAMPLE_STRINGS as S } from "./strings.reference-examples";

function WorkedExample({ example }: { example: ExplainedReferenceExample }) {
  const result = useMemo(() => computeReferenceExample(example), [example]);
  const built = useMemo(() => buildReferenceExample(example), [example]);
  const rawLines = built.source.split("\n");
  const focusedLine = rawLines.findIndex((line) => line === `${built.focusLabel}:`) + 1;
  const programLines = rawLines.map((line) =>
    line.replace(/\.L[A-Za-z0-9_.$]*/g, (label) => built.labelNames.get(label) ?? label),
  );
  const rowLabel = (row: (typeof result.rows)[number]) =>
    row.kind === "memory"
      ? S.memoryLabel(row.symbol ?? row.label, row.bytes ?? 1)
      : row.kind === "address"
        ? S.addressLabel(row.symbol ?? row.label)
        : row.label;
  return (
    <figure className="reference-worked-example" data-example={example.id}>
      <div className="reference-example-state" data-state="before">
        <h5>{S.before}</h5>
        <dl>
          {result.rows.map((row, i) => (
            <div key={i}>
              <dt>
                <code>{rowLabel(row)}</code>
                {row.reading && <small>{S[row.reading]}</small>}
              </dt>
              <dd>
                <output>{row.before}</output>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="reference-example-instruction">
        <h5>{S.instruction}</h5>
        <pre>
          <code>{result.instruction}</code>
        </pre>
      </div>
      <div className="reference-example-state" data-state="after">
        <h5>{S.after}</h5>
        <dl>
          {result.rows.map((row, i) => (
            <div key={i}>
              <dt>
                <code>{rowLabel(row)}</code>
                {row.reading && <small>{S[row.reading]}</small>}
              </dt>
              <dd>
                <output>{row.after}</output>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <figcaption>
        {example.explanation}
        {result.branch && (
          <p className="reference-branch-result">
            {result.branch.taken ? S.branchTaken : S.branchNotTaken}
          </p>
        )}
        <details className="reference-complete-example">
          <summary>{S.completeExample}</summary>
          <p>{S.completeExampleNote}</p>
          <pre>
            <code>
              {programLines.map((line, index) => (
                <Fragment key={index}>
                  {index === focusedLine ? <mark>{line}</mark> : line}
                  {"\n"}
                </Fragment>
              ))}
            </code>
          </pre>
        </details>
      </figcaption>
    </figure>
  );
}

function FormGuide({
  form,
  initiallyOpen,
  mnemonic,
  issueKey,
}: {
  form: InstructionFormGuide;
  initiallyOpen: boolean;
  mnemonic: string;
  issueKey?: string;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  const [first, ...more] = form.examples;
  return (
    <details
      className="reference-form"
      data-form={form.id}
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>{form.title}</summary>
      {open && (
        <div className="reference-form-body">
          {issueKey && (
            <aside className="reference-error-context" data-issue={issueKey}>
              <strong>{S.contextTitle}</strong>
              {issueKey === "immediate.addsub" && <p>{S.registerCapacityNote(mnemonic)}</p>}
            </aside>
          )}
          {form.syntax.map((syntax) => (
            <pre className="reference-form-syntax" key={syntax}>
              <code>{syntax}</code>
            </pre>
          ))}
          <ul className="reference-essential-rules">
            {form.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          {first && (
            <>
              <h4>{S.example}</h4>
              <p className="reference-example-preparation">{S.preparedNote}</p>
              <WorkedExample example={first} />
            </>
          )}
          {more.length > 0 && (
            <details className="reference-more-examples">
              <summary>{S.moreExamples}</summary>
              {more.map((example) => (
                <WorkedExample key={example.id} example={example} />
              ))}
            </details>
          )}
          {!!form.mistakes?.length && (
            <div className="reference-mistakes">
              <h4>{S.commonMistakes}</h4>
              {form.mistakes.map((mistake) => (
                <div className="reference-mistake" key={mistake.source}>
                  <span className="reference-rejected">{S.rejected}</span>
                  <pre>
                    <code>{mistake.source}</code>
                  </pre>
                  <p>{mistake.explanation}</p>
                </div>
              ))}
            </div>
          )}
          {!!form.advancedRules?.length && (
            <details className="reference-advanced-rules">
              <summary>{S.advancedRules}</summary>
              <ul>
                {form.advancedRules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </details>
  );
}

/** Only this opened lookup runs its independent examples. No lesson artifact enters the model. */
export function ReferenceInstructionForms({
  mnemonic,
  formId,
  issueKey,
}: {
  mnemonic: string;
  formId?: string;
  issueKey?: string;
}) {
  const forms = INSTRUCTION_FORM_GUIDES[mnemonic] ?? [];
  const selected =
    forms.find((form) => form.id === formId) ?? forms.find((form) => !form.advanced) ?? forms[0];
  const ordinary = forms
    .filter((form) => !form.advanced)
    .sort((a, b) => Number(b === selected) - Number(a === selected));
  const advanced = forms
    .filter((form) => form.advanced)
    .sort((a, b) => Number(b === selected) - Number(a === selected));
  return (
    <div className="reference-form-guides">
      {ordinary.map((form) => (
        <FormGuide
          key={form.id}
          form={form}
          initiallyOpen={form === selected}
          mnemonic={mnemonic}
          issueKey={form === selected ? issueKey : undefined}
        />
      ))}
      {advanced.length > 0 && (
        <details className="reference-advanced-forms" open={!!selected?.advanced}>
          <summary>{S.advancedForms}</summary>
          {advanced.map((form) => (
            <FormGuide
              key={form.id}
              form={form}
              initiallyOpen={form === selected}
              mnemonic={mnemonic}
              issueKey={form === selected ? issueKey : undefined}
            />
          ))}
        </details>
      )}
    </div>
  );
}
