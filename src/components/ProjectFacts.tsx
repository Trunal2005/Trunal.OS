import type { Project } from "../content/projects";
export default function ProjectFacts({ project }: { project: Project }) {
  return (
    <dl className="project-facts" aria-label={`${project.name} quick facts`}>
      <div>
        <dt>Stack</dt>
        <dd>{project.tags.slice(0, 4).join(" · ")}</dd>
      </div>
      <div>
        <dt>Type</dt>
        <dd>{project.projectType}</dd>
      </div>
      <div>
        <dt>Status</dt>
        <dd>
          {project.status === "in-development"
            ? "Active Development"
            : "Prototype"}
        </dd>
      </div>
      <div>
        <dt>Source</dt>
        <dd>
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
          )}
          {project.demoUrl && (
            <>
              {" "}
              ·{" "}
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Demo ↗
              </a>
            </>
          )}
        </dd>
      </div>
    </dl>
  );
}
