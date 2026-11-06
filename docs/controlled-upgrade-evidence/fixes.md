# Acceptance fixes recorded during the controlled upgrade

- Migrated historical assertions for empty Blue Cred, withheld email and hidden finalist only where the new owner brief explicitly supersedes them; retained all other regressions.
- After editorial reordering, BI is offscreen and lazy-loaded. Browser media checks now scroll the intended card into view before waiting, including forced-image-failure checks.
- The preserved Blue Cred floor pad is partly occluded by the Contact dish from overview. Its real edge is clickable; QA diagnostics sample the actual top surface rather than only occluded mesh centres. Geometry and default camera remain unchanged.
- Axe caught an invalid aria-busy attribute on picture; removed it, preserving the actual loading status indicator.
- Fullscreen image fit now contains the whole original by default. 100% view enables real-resolution scroll/pan. Footer source and keyboard hint now occupy separate lines.
- Text-size QA initially accumulated enlargement over hash navigations. Each test now reloads before doubling computed font sizes exactly once. This is explicitly text-size enlargement at a fixed viewport, not a claim of browser toolbar/pinch zoom.
- Manual 200% review identified overlapping district labels. Labels now wrap and a ResizeObserver reserves measured navigation height for desktop controls/panels, retaining normal geometry and camera poses.
- PDF fallback Tab wrap exposed a transient body focus; viewer now explicitly traps boundary Tab/Shift-Tab and restores the opener. Native local PDF rendering was observed in Chrome. Browser-internal chrome:// and chrome-extension:// native viewer resources are recorded separately from external HTTP requests.
- Blue Cred source inspection showed demo listings and presentational search/filter/sort controls. Removed the unsupported searchable-marketplace claim and documented the limitation.
- Concurrent Windows output-directory rebuilds hit EPERM. Stopped the owned QA preview and rebuilt sequentially successfully; user dev preview was preserved. No source or user data deleted.
- Generated isolated harness bundles are excluded from lint, alongside generated dist; the actual app, viewer and test scripts remain linted. No test assertion disabled to accommodate an app failure.

Final executed results, manually reviewed images and remaining limits are recorded separately in CONTROLLED_UPGRADE_REPORT.md. This log is not a claim of passing acceptance until those final results exist.

- Final manual deep-scroll review found the old case-study Close action scrolled away. It is now sticky; actual desktop and phone pointer-close checks passed, and the preserved media browser suite now asserts the action stays inside the visible dialog after scrolling 900px.
