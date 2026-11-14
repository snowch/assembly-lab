// Copyright © 2026 Christopher Snow

import { useEffect, useId, useRef, useState } from "react";
import { CalculatorWorkspace, ViewHandoffScope } from "@al/views";
import { HEADER_CALCULATOR as S } from "./strings.header-calculator";

/** One mounted scratch workspace, independent of routes and lesson artifacts. */
export function HeaderCalculator({ updating = false }: { updating?: boolean }) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState(() => matchMedia("(max-width: 760px)").matches);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    const media = matchMedia("(max-width: 760px)");
    const changed = () => setPhone(media.matches);
    media.addEventListener("change", changed);
    return () => media.removeEventListener("change", changed);
  }, []);
  useEffect(() => {
    const panel = dialog.current!;
    if (panel.open) panel.close();
    if (!open) return;
    if (phone) panel.showModal();
    else panel.show();
    close.current?.focus({ preventScroll: true });
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        panel.close();
        setOpen(false);
        trigger.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", escape);
    const previous = document.body.style.overflow;
    if (phone) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", escape);
      document.body.style.overflow = previous;
    };
  }, [open, phone]);
  const dismiss = () => {
    dialog.current?.close();
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  };
  return (
    <>
      <button
        type="button"
        className="header-calculator-button"
        ref={trigger}
        aria-label={S.button}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => (open ? dismiss() : setOpen(true))}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="21"
          height="21"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <rect x="4" y="2" width="16" height="20" rx="3" />
          <path d="M7 6h10M7 11h2m2 0h2m2 0h2M7 15h2m2 0h2m2 0h2M7 19h2m2 0h2m2 0h2" />
        </svg>
        <span>{S.button}</span>
      </button>
      <dialog
        id={id}
        className="header-calculator-dialog"
        aria-labelledby={`${id}-title`}
        aria-modal={open && phone ? true : undefined}
        ref={dialog}
        inert={updating}
        onCancel={(event) => {
          event.preventDefault();
          dismiss();
        }}
      >
        {open && (
          <div className="header-calculator-heading">
            <h2 id={`${id}-title`}>{S.title}</h2>
            <button type="button" ref={close} aria-label={S.closeLabel} onClick={dismiss}>
              {S.close}
            </button>
          </div>
        )}
        <ViewHandoffScope id="header-calculator">
          <CalculatorWorkspace handoffKey="global" active={open} />
        </ViewHandoffScope>
        {open && <p className="header-calculator-help">{S.persistence}</p>}
      </dialog>
    </>
  );
}
