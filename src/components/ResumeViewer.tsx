import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { publicResume, type ResumeAsset } from "../content/resume";

export function ResumeViewer({
  asset,
  onClose,
  forceNoInline = false,
}: {
  asset: ResumeAsset;
  onClose: () => void;
  forceNoInline?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [inline] = useState(
    () =>
      !forceNoInline &&
      window.matchMedia("(min-width: 900px)").matches &&
      navigator.pdfViewerEnabled,
  );
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, []);
  return createPortal(
    <dialog
      ref={ref}
      className="resume-viewer"
      aria-labelledby="resume-viewer-title"
      onKeyDown={(e) => {
        if (e.key === "Escape") e.stopPropagation();
        if (e.key !== "Tab") return;
        const controls = Array.from(
          ref.current?.querySelectorAll<HTMLElement>(
            "button:not([disabled]), a[href], object",
          ) ?? [],
        );
        const first = controls[0],
          last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <header>
        <div>
          <p className="kicker">PROFESSIONAL PROFILE</p>
          <h2 id="resume-viewer-title">Trunal Patil · Résumé</h2>
        </div>
        <button autoFocus onClick={onClose}>
          Close résumé
        </button>
      </header>
      <nav aria-label="Résumé actions">
        <a
          className="button primary"
          href={asset.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in new tab ↗
        </a>
        <a className="button" href={asset.url} download={asset.filename}>
          Download PDF
        </a>
      </nav>
      <p className="resume-help">
        Use your browser’s PDF controls to zoom and read. If the preview is
        blank, open the PDF in a new tab.
      </p>
      {inline ? (
        <object
          tabIndex={0}
          data={asset.url}
          type="application/pdf"
          title="Trunal Patil public résumé"
        >
          <p>
            Inline PDF preview unavailable. Use Open in new tab or Download PDF
            above.
          </p>
        </object>
      ) : (
        <section className="resume-fallback">
          <h3>Read at a comfortable size.</h3>
          <p>
            Open the PDF in your browser’s full viewer or download it for
            offline reading.
          </p>
        </section>
      )}
    </dialog>,
    document.body,
  );
}
export default function ResumeActions({
  asset = publicResume,
  forceNoInline = false,
}: {
  asset?: ResumeAsset | null;
  forceNoInline?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="resume-access">
      <h3>Résumé</h3>
      {asset ? (
        <button className="button primary" onClick={() => setOpen(true)}>
          View Résumé
        </button>
      ) : (
        <>
          <button className="button" disabled>
            Résumé coming soon
          </button>
          <p>My public-safe résumé will be available soon.</p>
        </>
      )}
      {open && asset && (
        <ResumeViewer
          asset={asset}
          forceNoInline={forceNoInline}
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  );
}
