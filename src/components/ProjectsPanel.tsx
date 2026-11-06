import { useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import {
  editorialProjects as projects,
  type Category,
} from "../content/projects";
import ProjectFacts from "./ProjectFacts";
import ProjectGallery from "./ProjectGallery";
export default function ProjectsPanel({
  onProject,
}: {
  onProject: (id: string) => void;
}) {
  const [filter, setFilter] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(true);
  const shown = projects.filter(
    (p) =>
      !p.placeholderOnly &&
      p.displayed &&
      (!featuredOnly ||
        filter !== "All" ||
        query.trim() ||
        p.featurePriority <= 4) &&
      (filter === "All" || p.category.includes(filter)) &&
      `${p.name} ${p.tags.join(" ")} ${p.shortDescription}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div className="project-panel-content">
      <p className="section-lede">
        Working interfaces. Explainable decisions. Source you can inspect.
      </p>
      <details className="project-discovery">
        <summary>Search & filters · all six projects</summary>
        <label className="project-search">
          <Search size={17} />
          <span className="sr-only">Search projects</span>
          <input
            type="search"
            placeholder="Search work, tools or systems…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="filter-bar" aria-label="Filter projects">
          <button
            aria-pressed={featuredOnly && filter === "All" && !query}
            onClick={() => {
              setFeaturedOnly(true);
              setFilter("All");
              setQuery("");
            }}
          >
            Selected work
          </button>
          {(
            ["All", "Full Stack", "AI", "Data", "Systems", "Security"] as const
          ).map((c) => (
            <button
              aria-pressed={filter === c && (c !== "All" || !featuredOnly)}
              onClick={() => {
                setFilter(c);
                setFeaturedOnly(false);
              }}
              key={c}
            >
              {c === "All" ? "All work" : c}
            </button>
          ))}
        </div>
      </details>
      <div className="selected-projects">
        {shown.length === 0 && (
          <p className="empty-state">
            No projects match. Try another tool or category.
          </p>
        )}
        {shown.map((p, i) => (
          <article
            className={`project-story-preview ${p.featurePriority <= 4 ? "featured-project" : "secondary-project"}`}
            data-project={p.id}
            key={p.id}
          >
            <button
              className="project-card-title"
              onClick={() => onProject(p.id)}
              aria-label={`Read ${p.name} case study`}
            >
              <div className="project-preview-body">
                <span className="kicker">
                  {p.featurePriority === 1
                    ? "FLAGSHIP / "
                    : p.featurePriority <= 4
                      ? "FEATURED / "
                      : "MORE ENGINEERING / "}
                  {p.category.join(" · ")}
                </span>
                <div>
                  <h3>{p.name}</h3>
                  <ArrowUpRight size={22} />
                </div>
              </div>
            </button>
            <ProjectGallery project={p} priority={i === 0} />
            <ProjectFacts project={p} />
            <div className="project-card-summary">
              <p>{p.shortDescription}</p>
              <ul>
                {p.highlights.slice(0, 2).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <div className="project-card-links">
                <button onClick={() => onProject(p.id)}>
                  Engineering case study <ArrowUpRight size={16} />
                </button>
                <a
                  href={p.repositoryUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View source <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
