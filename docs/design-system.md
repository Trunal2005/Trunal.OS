# TRUNAL.OS — design and architecture

**Superseded first-view architecture:** the strict 3D rebuild replaces the historical split-screen/editorial shell described below. Current first view is a full-viewport perspective engineering campus, with a compact HUD, projected station labels, six physically different destinations and contextual drawers. See `3d-rebuild-report.md` for current implementation and verification, and `3d-rebuild-changelog.md` for visual iteration. The old shell is archived locally, not the current homepage.

Original metaphor: an engineer's small interconnected systems lab, not a city or a game. An offset editorial introduction gives the owner priority; a tilted network model occupies the right-hand hero stage. Six distinct station silhouettes surround a layered computational core: stacked data plates, database cylinders, antenna frame, branching OSS pillars, ascending journey steps and a contact beacon. Cyan routes explain shared context. No downloaded 3D assets, cloned source, traced reference composition or proprietary logos.

Graphite #101416, pale paper #eef2eb, ice mint #a3f2dc, secondary gray #a5b1ae. System sans typography with compact monospace metadata. Restrained linework, generous spacing, thin borders and numbered sections. No remote fonts. Animation uses R3F frame interpolation; no postprocessing or autoplay audio.

React/TypeScript semantic document contains all content. A lazy-loaded R3F Canvas is progressive enhancement. Hash routes select stations and case studies. Native dialog provides focus containment, Escape and focus restoration. DOM station buttons expose every spatial action. Explicit 2D, low-power and motion settings; narrow screens, reduced motion and data saver start in 2D. DPR capped at 1.5 (1 in low power). Scene errors/context loss fall back to the network diagram. No visitor data requests.

Milestone sequence: M0 audit/provenance → M1 semantic editorial shell/data → M2 procedural scene → M3 routing/camera/dialog interaction → M4 documented case studies → M5 local PR snapshot → M6 automated and browser QA → M7 manual deployment preparation. Scene registry is independent of project registry.
