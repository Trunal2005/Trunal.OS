import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  RotateCcw,
  Settings2,
  X,
} from "lucide-react";
import { stations, canonicalStation, type StationId } from "./content/stations";
import { profile } from "./content/profile";
import { projects } from "./content/projects";
import { skillCategories, type SkillCategoryId } from "./content/skills";
import { roles } from "./content/experience";
import ContactSection from "./components/ContactSection";
import portrait from "./assets/trunal-portrait.webp";
import SkillsLab from "./components/SkillsLab";
import ExperienceStudio from "./components/ExperienceStudio";
import {
  AboutSection,
  AchievementsSection,
} from "./components/PersonalSections";
import ProjectsPanel from "./components/ProjectsPanel";
import Observatory from "./components/Observatory";
import { CaseStudy } from "./components/ProjectDetails";
const World = lazy(() => import("./scene/WorldCanvas"));
class Boundary extends Component<
  { children: ReactNode; fail: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.fail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function parsePortfolioRoute(raw: string) {
  let hash = raw.replace(/^#/, "");
  try {
    hash = decodeURIComponent(hash);
  } catch {
    hash = "";
  }
  const parts = hash.split("/");
  const station = canonicalStation(parts[0]);
  const project =
    station === "projects"
      ? (projects.find(
          (p) => p.slug === parts.slice(1).join("/") && !p.placeholderOnly,
        ) ?? null)
      : null;
  const category =
    station === "skills"
      ? parts[1] === "all"
        ? "all"
        : (skillCategories.find(
            (c) =>
              c.id ===
              (parts[1] ??
                (parts[0] === "ai"
                  ? "ai"
                  : parts[0] === "networks"
                    ? "networks"
                    : "frontend")),
          )?.id ?? "frontend")
      : null;
  const stage =
    station === "experience"
      ? (roles.flatMap((role) => role.pipeline).find((s) => s.id === parts[1])
          ?.id ?? null)
      : null;
  const pr =
    station === "opensource" && parts.length > 1
      ? parts.slice(1).join("/")
      : null;
  return {
    station,
    project,
    category: category as SkillCategoryId | "all" | null,
    stage,
    pr,
    explicitDetail: parts.length > 1,
  };
}
export default function PortfolioApp() {
  const [route, setRoute] = useState(() => parsePortfolioRoute(location.hash));
  const [mode, setMode] = useState<"3D" | "2D">(() =>
    innerWidth < 900 ||
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData ||
    ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) < 4
      ? "2D"
      : "3D",
  );
  const [motion, setMotion] = useState(
    !matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [lowPower, setLowPower] = useState(innerWidth < 900);
  const [settings, setSettings] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [skipIntro, setSkipIntro] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [gpuFailed, setGpuFailed] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const selected = route.station;
  const active = stations.find((s) => s.id === selected);
  const setHash = (hash: string) => {
    if (location.hash === `#${hash}`) setRoute(parsePortfolioRoute(hash));
    else location.hash = hash;
  };
  function navigate(id: StationId | null) {
    if (id && id !== selected)
      returnFocus.current = document.activeElement as HTMLElement;
    setHash(id ?? "");
  }
  function home() {
    navigate(null);
    setResetKey((n) => n + 1);
  }
  function detail(id: string) {
    if (id.startsWith("skill-")) {
      setHash(`skills/${id.slice(6)}`);
      return;
    }
    if (id.startsWith("stage-")) {
      setHash(`experience/${id.slice(6)}`);
      return;
    }
    if (id.startsWith("pr-")) {
      setHash(`opensource/${encodeURIComponent(id.slice(3))}`);
      return;
    }
    if (id.startsWith("journey-")) {
      setHash("about");
      return;
    }
    const p = projects.find((p) => p.id === id && !p.placeholderOnly);
    if (p) setHash(`projects/${p.slug}`);
  }
  useEffect(() => {
    const change = () => setRoute(parsePortfolioRoute(location.hash));
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    if (selected && !route.project) {
      panel.current?.querySelector(".district-panel-body")?.scrollTo(0, 0);
      if (mode === "2D" && innerWidth < 900)
        window.scrollTo({ top: 0, behavior: "instant" });
      panel.current?.focus({ preventScroll: true });
    } else if (!selected && returnFocus.current?.isConnected)
      returnFocus.current.focus({ preventScroll: true });
  }, [selected]);
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(!motion);
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      setMotion(!media.matches);
      if (media.matches) setMode("2D");
    };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, [motion]);
  useEffect(() => {
    if (!sceneReady) return;
    const timer = setTimeout(() => setIntroDone(true), 1500);
    return () => clearTimeout(timer);
  }, [sceneReady]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("dialog[open]")) {
        if (settings) {
          setSettings(false);
          document
            .querySelector<HTMLButtonElement>(
              '[aria-label="Display preferences"]',
            )
            ?.focus();
        } else if (selected) home();
      }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  });
  useEffect(() => {
    const nav = document.getElementById("section-navigation");
    const root = nav?.closest<HTMLElement>(".portfolio-app");
    if (!nav || !root || typeof ResizeObserver === "undefined") return;
    const measure = () => root.style.setProperty("--section-navigation-height", `${nav.clientHeight}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);
  const focusDetail =
    route.project?.id ??
    (selected === "skills" && route.explicitDetail && route.category !== "all"
      ? route.category
      : (route.stage ?? route.pr)) ??
    null;
  return (
    <div
      className={`portfolio-app ${mode === "3D" ? "immersive-mode" : "index-mode"} ${selected ? "district-open" : ""}`}
    >
      <a
        className="skip-link"
        href="#section-navigation"
        onClick={(e) => {
          e.preventDefault();
          document
            .querySelector<HTMLButtonElement>(".section-navigation button")
            ?.focus();
        }}
      >
        Skip to sections
      </a>
      <header className="portfolio-header">
        <button
          className="portfolio-brand"
          onClick={home}
          aria-label="TRUNAL.OS overview"
        >
          <span className="identity-mark">
            <img src={portrait} alt="" width={34} height={34} />
          </span>
          TRUNAL<span>.OS</span>
        </button>
        <span className="header-location">
          MUMBAI, INDIA / ENGINEERING STUDENT
        </span>
        <div className="header-actions">
          <button onClick={() => navigate("contact")}>
            Let’s connect
            <ArrowUpRight size={16} />
          </button>
          <button
            className="preferences-button"
            aria-label="Display preferences"
            aria-expanded={settings}
            onClick={() => setSettings(!settings)}
          >
            <Settings2 size={19} />
          </button>
        </div>
      </header>
      <main id="portfolio-main">
        {mode === "3D" ? (
          <Boundary
            fail={() => {
              setGpuFailed(true);
              setMode("2D");
            }}
          >
            <Suspense
              fallback={
                <div className="world-loading">
                  <p>Building the view. The portfolio is ready.</p>
                  <button onClick={() => setMode("2D")}>
                    Skip 3D / use section index
                    <ArrowRight size={16} />
                  </button>
                </div>
              }
            >
              <World
                selected={selected}
                projectId={focusDetail}
                motion={motion}
                lowPower={lowPower}
                resetKey={resetKey}
                onSelect={navigate}
                onProject={detail}
                onHome={home}
                onFailure={() => {
                  setGpuFailed(true);
                  setMode("2D");
                }}
                onLowPower={() => setLowPower(true)}
                onReady={() => setSceneReady(true)}
                skipIntro={skipIntro}
              />
            </Suspense>
          </Boundary>
        ) : null}
        {!selected ? (
          <section className="identity-intro" aria-labelledby="identity-title">
            <p className="kicker">A DEVELOPER. A BUILDER. A COLLABORATOR.</p>
            <h1 id="identity-title">
              Trunal Patil<span>.</span>
            </h1>
            <h2>
              Full-stack development.
              <br />
              Agentic AI & data systems.
            </h2>
            <p>{profile.intro}</p>
            <div className="intro-actions">
              <button
                className="primary-action"
                onClick={() => navigate("projects")}
              >
                Selected work
                <ArrowUpRight size={16} />
              </button>
              <button onClick={() => navigate("experience")}>
                My experience
                <ArrowRight size={16} />
              </button>
            </div>
          </section>
        ) : (
          <h1 className="sr-only">{active?.label} — Trunal Patil</h1>
        )}
        {mode === "2D" && !selected && (
          <section className="portfolio-index" aria-labelledby="index-title">
            <div className="index-heading">
              <p className="kicker">THE COMPLETE PORTFOLIO</p>
              <h2 id="index-title">Choose your way in.</h2>
            </div>
            <div className="section-index-grid">
              {stations.map((s) => (
                <button
                  key={s.id}
                  data-index={s.id}
                  onClick={() => navigate(s.id)}
                >
                  <span className="index-number">{s.number}</span>
                  <span>
                    <strong>{s.navLabel}</strong>
                    <small>{s.description}</small>
                  </span>
                  <ArrowUpRight size={21} />
                </button>
              ))}
            </div>
            <p className="index-footer">
              Same work. Same story. A lighter way to explore.
            </p>
          </section>
        )}
        {selected && (
          <aside
            className="district-panel"
            data-district={selected}
            ref={panel}
            tabIndex={-1}
            aria-labelledby="district-title"
          >
            <div className="district-panel-bar">
              <button onClick={home}>
                <ArrowLeft size={17} />
                Overview
              </button>
              <button aria-label="Close section" onClick={home}>
                <X size={22} />
              </button>
            </div>
            {selected === "projects" && (
              <header className="project-district-heading">
                <p className="kicker">BUILD FOUNDRY / 01</p>
                <h2 id="district-title">
                  Projects<span>.</span>
                </h2>
              </header>
            )}
            <div className="district-panel-body">
              {selected !== "projects" && (
                <>
                  <p className="kicker">
                    {active?.description.toUpperCase()} / {active?.number}
                  </p>
                  <h2 id="district-title">
                    {active?.label}
                    <span>.</span>
                  </h2>
                </>
              )}
              {selected === "projects" ? (
                <ProjectsPanel onProject={detail} />
              ) : selected === "skills" ? (
                <SkillsLab
                  category={route.category ?? "frontend"}
                  onCategory={(id) => setHash(`skills/${id}`)}
                />
              ) : selected === "experience" ? (
                <ExperienceStudio
                  stage={route.stage}
                  onStage={(id) => setHash(`experience/${id}`)}
                />
              ) : selected === "opensource" ? (
                <Observatory
                  embedded
                  selectedId={route.pr}
                  onSelectId={(id) =>
                    setHash(`opensource/${encodeURIComponent(id)}`)
                  }
                />
              ) : selected === "about" ? (
                <AboutSection />
              ) : selected === "achievements" ? (
                <AchievementsSection />
              ) : (
                <ContactSection />
              )}
            </div>
          </aside>
        )}
      </main>
      <div className="view-controls">
        <span className="view-instruction">
          {mode === "3D"
            ? "Drag to orbit · Scroll to zoom · Select a district"
            : "Content-first view · All seven sections available"}
        </span>
        <div>
          <button aria-label="Reset world view" onClick={home}>
            <RotateCcw size={17} />
          </button>
          <div className="display-modes" aria-label="Display mode">
            {(["3D", "2D"] as const).map((m) => (
              <button
                key={m}
                aria-pressed={mode === m}
                onClick={() => {
                  setGpuFailed(false);
                  setMode(m);
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
      {mode === "3D" &&
        !selected &&
        sceneReady &&
        !introDone &&
        motion &&
        !skipIntro && (
          <button
            className="skip-glide"
            onClick={() => {
              setSkipIntro(true);
              setIntroDone(true);
            }}
          >
            Skip camera glide
          </button>
        )}
      <nav
        className="section-navigation"
        id="section-navigation"
        aria-label="Portfolio sections"
      >
        {stations.map((s) => (
          <button
            key={s.id}
            aria-label={`Explore ${s.label}`}
            aria-current={selected === s.id ? "location" : undefined}
            onClick={() => navigate(s.id)}
          >
            <span>{s.number}</span>
            <span className="nav-label">{s.navLabel}</span>
            <ArrowUpRight size={14} />
          </button>
        ))}
      </nav>
      {settings && (
        <section
          className="display-preferences"
          aria-label="Display preferences"
        >
          <h2>Make it comfortable.</h2>
          <label>
            <input
              type="checkbox"
              checked={!motion}
              onChange={(e) => setMotion(!e.target.checked)}
            />
            Reduced motion
          </label>
          <label>
            <input
              type="checkbox"
              checked={lowPower}
              onChange={(e) => setLowPower(e.target.checked)}
            />
            Low power rendering
          </label>
          <p>
            Mobile opens in the lighter section index. 3D is optional. No sound,
            tracking or remote data requests.
          </p>
        </section>
      )}
      {gpuFailed && (
        <p className="gpu-fallback-note" role="status">
          3D is unavailable. Every section works in this view.
        </p>
      )}
      <CaseStudy project={route.project} onClose={() => navigate("projects")} />
    </div>
  );
}
