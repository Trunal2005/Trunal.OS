import { useEffect, useRef } from "react";
import { Check, X, ArrowUpRight } from "lucide-react";
import type { Project } from "../content/projects";
import ProjectFacts from "./ProjectFacts";
import ProjectGallery from "./ProjectGallery";
export function ProjectGraphic({ id }: { id: string }) {
  return (
    <div className={`project-graphic graphic-${id}`} aria-hidden="true">
      <span className="graphic-caption">
        {id === "bi"
          ? "DATA → CONTEXT → INSIGHT"
          : id === "recovery"
            ? "POLICY → DECISION → PROOF"
            : id === "cybertwin"
              ? "OBSERVE / MODEL / INVESTIGATE"
              : id === "anumitra"
                ? "REVIEW → EVIDENCE → APPROVAL"
                : "DOCUMENT → EXTRACT → COMPARE"}
      </span>
      <div className="schematic">
        {id === "bi" ? (
          <>
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <div className="chart-line" />
          </>
        ) : id === "recovery" ? (
          <>
            <div className="flow-box">POLICY</div>
            <span>→</span>
            <div className="flow-box round">
              <Check size={30} />
            </div>
            <span>→</span>
            <div className="flow-box">VERIFY</div>
          </>
        ) : id === "cybertwin" ? (
          <div className="radar">
            <div />
            <span />
            <i />
            <i />
            <i />
          </div>
        ) : id === "anumitra" ? (
          <div className="approval-flow">
            {[1, 2, 3, 4].map((n) => (
              <div key={n}>
                <Check size={15} />
                <span>0{n}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="document-art">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
      </div>
      <span className="graphic-label">
        CONCEPTUAL ARCHITECTURE / NOT A PRODUCT SCREENSHOT
      </span>
    </div>
  );
}
export function CaseStudy({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const previous = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (project && dialog.current) dialog.current.scrollTop = 0;
    if (project && !dialog.current?.open) {
      previous.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
      if (dialog.current) dialog.current.scrollTop = 0;
    } else if (!project && dialog.current?.open) {
      dialog.current.close();
      previous.current?.focus();
    }
  }, [project]);
  return (
    <dialog
      ref={dialog}
      className="case-dialog"
      aria-labelledby="case-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {project && (
        <div className="dialog-inner">
          <button
            className="icon-button close-dialog"
            onClick={onClose}
            aria-label="Close case study"
          >
            <X size={22} />
          </button>
          <p className="eyebrow">
            PROJECT NOTES / {project.status.toUpperCase()}
          </p>
          <h2 id="case-title">{project.name}</h2>
          <p className="dialog-subtitle">{project.subtitle}</p>
          <p className="case-problem">{project.problem}</p>
          <ProjectGallery key={project.id} project={project} priority />
          <ProjectFacts project={project} />
          <h3>What the prototype does</h3>
          <ul>
            {project.highlights.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <h3>My contribution</h3>
          <p>{project.role}</p>
          <h3>Engineering choices</h3>
          <ul>
            {project.engineeringDecisions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="tags">
            {project.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <details className="architecture-detail">
            <summary>Architecture detail / conceptual diagram</summary>
            <p>{project.architecture}</p>
            <ProjectGraphic id={project.id} />
          </details>
          <h3>Scope & trade-offs</h3>
          <ul>
            {project.challenges.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <h3>Evidence & limits</h3>
          <p className="evidence-note">
            Repository documentation reviewed {project.lastVerifiedAt}. These
            screenshots show actual prototype interfaces using demonstration
            data. The portfolio review has not independently rerun the projects’
            full test suites or validated live integrations.
          </p>
          {project.repositoryUrl && (
            <a
              className="button primary"
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the source <ArrowUpRight size={17} />
            </a>
          )}
        </div>
      )}
    </dialog>
  );
}
