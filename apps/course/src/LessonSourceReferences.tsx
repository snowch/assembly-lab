// Copyright © 2026 Christopher Snow

import { LessonProse } from "@al/views";
import type { LessonSources, SourceReference } from "@al/content";
import { LESSON_SOURCE_STRINGS as S } from "./strings.lesson-sources";

export function LessonSourceReferences({ sources }: { sources: LessonSources }) {
  const links = (references: readonly SourceReference[]) => (
    <ul className="lesson-source-links">
      {references.map((reference) => (
        <li key={reference.url}>
          <a href={reference.url}>{reference.label}</a>
        </li>
      ))}
    </ul>
  );
  const grouped = sources.instructions.length > 0 && sources.otherSources.length > 0;
  if (!sources.authoredProse && !sources.instructions.length && !sources.otherSources.length)
    return null;
  return (
    <details className="lesson-source-references" id="lesson-source-references">
      <summary>{S.summary}</summary>
      <div className="lesson-source-reference-body">
        {sources.authoredProse ? (
          <LessonProse markdown={sources.authoredProse} />
        ) : (
          <>
            {sources.instructions.length > 0 && (
              <>
                {grouped && <h2>{S.instructions}</h2>}
                {links(sources.instructions)}
              </>
            )}
            {sources.otherSources.length > 0 && (
              <>
                {grouped && <h2>{S.otherSources}</h2>}
                {links(sources.otherSources)}
              </>
            )}
          </>
        )}
      </div>
    </details>
  );
}
