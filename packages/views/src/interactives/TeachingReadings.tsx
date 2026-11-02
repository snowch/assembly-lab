// Copyright © 2026 Christopher Snow

import { useMemo, type ReactNode } from "react";
import { Prose } from "@platform/lesson-runtime";

import { BitToggles } from "../BitToggles";
import { bitWeightsOfPattern, NO_BITS, shown, type Readings, type TopBitTable } from "../readings";
import { VIEW_STRINGS as S } from "../strings";
import { MODULE1_STRINGS as M1 } from "../strings.module1";
import { READER_STRINGS as R } from "../strings.reader";
import { useHandoffState } from "../update-handoff";

type ReadingView = "unsigned" | "signed" | "compare";
const views = ["unsigned", "signed", "compare"] as const;
const positions = [31, 30, null, 3, 2, 1, 0] as const;
const decimal = (value: number): string => shown(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const part = (value: number): string => (value > 0 ? `+${decimal(value)}` : decimal(value));

/** Teaching is opt-in: the scratch reader and hexadecimal activity keep their existing controls. */
export function TeachingReadings({
  register,
  first,
  bits,
  onBits,
  readings,
  table,
  calculation,
}: {
  register: string;
  first: string;
  bits: string;
  onBits: (bits: string) => void;
  readings: Readings;
  table: TopBitTable;
  calculation: (readings: readonly ("unsigned" | "signed")[]) => ReactNode;
}) {
  const [view, setView] = useHandoffState<ReadingView>("RegisterReader.reading", "unsigned");
  const weights = useMemo(
    () => ({
      unsigned: bitWeightsOfPattern(bits, "unsigned"),
      signed: bitWeightsOfPattern(bits, "signed"),
    }),
    [bits],
  );
  const visible = view === "compare" ? (["unsigned", "signed"] as const) : [view];
  return (
    <div
      className="al-figure al-reader al-teaching-reader"
      data-figure="register-reader"
      data-register={register}
      data-view={view}
    >
      <div className="al-reading-views" role="group" aria-label={R.viewsLabel}>
        {views.map((name) => (
          <button
            type="button"
            key={name}
            className="button secondary"
            aria-pressed={view === name}
            onClick={() => setView(name)}
          >
            {R.views[name]}
          </button>
        ))}
      </div>
      <Prose markdown={R.guidance[view]} className="al-reader-guidance" />
      <BitToggles
        bits={bits}
        onChange={onBits}
        label={S.toggles.group(register)}
        digits={readings.digits}
        topBit
        groupOutline
      />
      <div className="al-pattern" data-reading="hex">
        <span className="al-reading-name">{M1.reader.pattern}</span>
        <code className="al-reading-value">0x{readings.digits}</code>
      </div>
      <div className="al-reader-actions">
        <button type="button" className="button secondary" onClick={() => onBits(NO_BITS)}>
          {M1.reader.clearBits}
        </button>
        <button
          type="button"
          className="button secondary"
          onClick={() => {
            onBits(first);
            setView("unsigned");
          }}
        >
          {first === "1".repeat(32) ? R.reset : R.resetExample}
        </button>
      </div>
      <figure className="al-weight-diagram">
        <figcaption>{R.caption}</figcaption>
        <p className="al-weight-scroll-cue">{R.scrollCue} →</p>
        <div className="al-weight-scroll" role="region" aria-label={R.diagramLabel} tabIndex={0}>
          <table className="al-weight-strip">
            <thead>
              <tr>
                <th scope="row">{R.bit}</th>
                {positions.map((bit, index) => (
                  <th
                    scope="col"
                    key={index}
                    data-weight-bit={bit ?? undefined}
                    aria-label={bit === null ? R.omittedBits : undefined}
                  >
                    {bit === null ? "…" : bit}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr data-weight-row="value">
                <th scope="row">{R.value}</th>
                {positions.map((bit, index) => (
                  <td key={index} data-weight-bit={bit ?? undefined}>
                    {bit === null ? "…" : weights.unsigned[31 - bit]!.value}
                  </td>
                ))}
              </tr>
              {visible.map((reading) => (
                <tr key={reading} data-weight-row={reading}>
                  <th scope="row">
                    {view === "compare"
                      ? reading === "unsigned"
                        ? R.unsignedWeight
                        : R.signedWeight
                      : R.weight}
                  </th>
                  {positions.map((bit, index) => (
                    <td key={index} data-weight-bit={bit ?? undefined}>
                      {bit === null ? "…" : decimal(weights[reading][31 - bit]!.weight)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>
      <div
        className="al-reader-table-scroll"
        role="region"
        aria-label={M1.reader.table}
        tabIndex={0}
      >
        <table className="al-top-table" aria-label={M1.reader.table}>
          <thead>
            <tr>
              <td />
              {visible.map((reading) => (
                <th scope="col" key={reading}>
                  {R.views[reading]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr data-row="top">
              <th scope="row">{M1.reader.topBitRow}</th>
              {visible.map((reading) => (
                <td data-cell={reading} key={reading}>
                  {part(table.top[reading])}
                </td>
              ))}
            </tr>
            <tr data-row="other">
              <th scope="row">{M1.reader.otherRow}</th>
              {visible.map((reading) => (
                <td data-cell={reading} key={reading}>
                  {part(table.other)}
                </td>
              ))}
            </tr>
            <tr data-row="result" className="al-top-result">
              <th scope="row">{M1.reader.resultRow}</th>
              {visible.map((reading) => (
                <td data-reading={reading} key={reading}>
                  <span className="al-reading-value">{decimal(readings[reading])}</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {calculation(visible)}
    </div>
  );
}
