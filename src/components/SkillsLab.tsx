import {
  ArrowUpRight,
  Braces,
  Database,
  FlaskConical,
  GitBranch,
  Network,
  Server,
} from "lucide-react";
import {
  skillCategories,
  skills,
  type SkillCategoryId,
} from "../content/skills";
import { projects } from "../content/projects";
const icons = {
  frontend: Braces,
  backend: Server,
  ai: FlaskConical,
  data: Database,
  tools: GitBranch,
  networks: Network,
};
export default function SkillsLab({
  category,
  onCategory,
}: {
  category: SkillCategoryId | "all";
  onCategory: (id: SkillCategoryId | "all") => void;
}) {
  const active = skillCategories.find((c) => c.id === category);
  return (
    <div className="skills-lab">
      <p className="section-lede">
        Tools are more useful with context. Explore what I’ve used, where it
        appears, and what I’m still learning.
      </p>
      <div className="skill-domain-tabs" aria-label="Skill domains">
        {skillCategories.map((c) => {
          const Icon = icons[c.id];
          return (
            <button
              key={c.id}
              aria-pressed={category === c.id}
              onClick={() => onCategory(c.id)}
            >
              <Icon size={20} />
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>
      <button
        className="index-toggle"
        aria-pressed={category === "all"}
        onClick={() => onCategory(category === "all" ? "frontend" : "all")}
      >
        {category === "all"
          ? "Return to Frontend"
          : "Show all skills / HTML index"}
        <ArrowUpRight size={15} />
      </button>
      {active && (
        <div className={`skill-workbench domain-${active.id}`}>
          <div className="workbench-head">
            <span>TECHNOLOGY LAB / {active.name.toUpperCase()}</span>
            <strong>{active.kicker}</strong>
          </div>
          <div
            className="skill-flow"
            aria-label={`${active.name} conceptual workflow`}
          >
            {active.flow.map((s, i) => (
              <div key={s}>
                <span>0{i + 1}</span>
                <strong>{s}</strong>
                {i < 2 && <i aria-hidden="true">→</i>}
              </div>
            ))}
          </div>
          <p>{active.description}</p>
        </div>
      )}
      <div className="skill-index">
        {skillCategories
          .filter((c) => category === "all" || c.id === category)
          .map((c) => (
            <section key={c.id} aria-labelledby={`skill-heading-${c.id}`}>
              <h3 id={`skill-heading-${c.id}`}>{c.name}</h3>
              <div className="skill-records">
                {skills
                  .filter((s) => s.visible && s.category === c.id)
                  .map((s) => (
                    <article key={s.name}>
                      <div>
                        <h4>{s.name}</h4>
                        <span
                          className={`evidence-badge ${s.verified ? "documented" : "learning"}`}
                        >
                          {s.evidenceLevel === "repository-documented"
                            ? "Used in public work"
                            : s.evidenceLevel === "concept-explored"
                              ? "Concept explored"
                              : "Résumé-listed"}
                        </span>
                      </div>
                      <p>{s.application}</p>
                      {s.evidenceProjectIds.length > 0 && (
                        <div className="skill-evidence-links">
                          {s.evidenceProjectIds.map((id) => {
                            const p = projects.find((p) => p.id === id)!;
                            return (
                              <a href={`#projects/${p.slug}`} key={id}>
                                {p.name}
                                <ArrowUpRight size={12} />
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </article>
                  ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
