import {
  ArrowRight,
  Users,
  Workflow,
  MessagesSquare,
  ChartNoAxesCombined,
} from "lucide-react";
import { roles } from "../content/experience";
const icons = [Users, MessagesSquare, Workflow, ChartNoAxesCombined];
export default function ExperienceStudio({
  stage,
  onStage,
}: {
  stage: string | null;
  onStage: (id: string) => void;
}) {
  return (
    <div className="experience-studio">
      {roles
        .filter((r) => r.visible)
        .map((role) => {
          const active =
            role.pipeline.find((p) => p.id === stage) ?? role.pipeline[0];
          return (
            <article key={role.id}>
              <div className="nitrix-role-card">
                <span className="nitrix-wordmark">
                  N<span>↗</span>
                </span>
                <p className="kicker">
                  CREATOR PARTNERSHIPS · OPERATIONS · ANALYSIS
                </p>
                <h3>{role.company}</h3>
                <strong>{role.role}</strong>
                <p className="role-dates">
                  {role.start} — {role.end}
                </p>
              </div>
              <section>
                <h3>The context</h3>
                <p>{role.context}</p>
              </section>
              <section className="campaign-workflow">
                <div className="subsection-heading">
                  <h3>From conversation to campaign</h3>
                  <span>ABSTRACT WORKFLOW</span>
                </div>
                <div className="campaign-stages">
                  {role.pipeline.map((s, i) => {
                    const Icon = icons[i % icons.length];
                    return (
                      <button
                        key={s.id}
                        aria-pressed={active.id === s.id}
                        onClick={() => onStage(s.id)}
                      >
                        <Icon size={20} />
                        <span>{s.name}</span>
                        {i < role.pipeline.length - 1 && (
                          <ArrowRight size={13} className="stage-arrow" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="stage-description" role="status">
                  <strong>{active.name}</strong>
                  <p>{active.description}</p>
                </div>
              </section>
              <section>
                <h3>My responsibilities</h3>
                <div className="responsibility-list">
                  {role.responsibilities.map((r, i) => (
                    <article key={r.title}>
                      <span>0{i + 1}</span>
                      <div>
                        <h4>{r.title}</h4>
                        <p>{r.body}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
              <section className="transferable">
                <h3>What I carry into engineering</h3>
                <p>
                  Clear expectations, reliable coordination and decisions
                  informed by evidence matter in both campaign work and software
                  teams.
                </p>
                <ul>
                  {role.transferable.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </section>
            </article>
          );
        })}
    </div>
  );
}
