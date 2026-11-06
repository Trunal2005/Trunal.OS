import { useState } from "react";
import { ArrowUpRight, GitMerge, GitPullRequest, Search } from "lucide-react";
import bundledSnapshot from "../data/prs.generated.json";
import {
  featuredPrIds,
  prSpotlights,
  prStoryDetails,
} from "../content/featured-prs";
import { links } from "../content/links";
export type PrSnapshot = {
  lastVerifiedAt: string | null;
  items: typeof bundledSnapshot.items;
};
export default function Observatory({
  data = bundledSnapshot,
  embedded = false,
  selectedId = null,
  onSelectId,
}: {
  data?: PrSnapshot;
  embedded?: boolean;
  selectedId?: string | null;
  onSelectId?: (id: string) => void;
}) {
  const snapshot = data;
  const [query, setQuery] = useState("");
  const [state, setState] = useState("all");
  const [sort, setSort] = useState("newest");
  const [scope, setScope] = useState("external");
  const scoped = snapshot.items.filter((p) => scope === "all" || p.external);
  const spotlight = snapshot.items.find(
    (p) =>
      p.id === (selectedId ?? featuredPrIds[0]) &&
      p.state === "merged" &&
      p.mergedAt,
  );
  const filtered = scoped
    .filter((p) =>
      `${p.repository} ${p.title} #${p.number}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "newest"
        ? b.createdAt.localeCompare(a.createdAt)
        : a.createdAt.localeCompare(b.createdAt),
    );
  return (
    <section
      id={embedded ? undefined : "opensource"}
      className="section observatory"
      aria-labelledby="oss-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">02 / OPEN SOURCE</p>
          <h2 id="oss-title">
            Better, together<span>.</span>
          </h2>
        </div>
        <p>
          Small fixes with consequences.
          <br />
          Real contributions to shared software.
        </p>
      </div>
      <div className="oss-topline">
        {snapshot.lastVerifiedAt && (
          <div className="pr-totals">
            <span>
              <GitMerge size={18} />
              <strong>
                {scoped.filter((p) => p.state === "merged").length}
              </strong>{" "}
              merged
            </span>
            <span>
              <GitPullRequest size={18} />
              <strong>
                {scoped.filter((p) => p.state === "open").length}
              </strong>{" "}
              under review
            </span>
          </div>
        )}
        <a href={links.allPrs} target="_blank" rel="noreferrer">
          All PRs on GitHub <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="pr-controls">
        <div
          className="featured-pr-tabs"
          aria-label="Featured contribution stories"
        >
          {featuredPrIds.map((id) => {
            const p = snapshot.items.find(
              (p) => p.id === id && p.state === "merged" && p.mergedAt,
            );
            return p ? (
              <button
                key={id}
                aria-pressed={spotlight?.id === id}
                onClick={() => onSelectId?.(id)}
              >
                {p.repository.split("/")[1]} #{p.number}
              </button>
            ) : null;
          })}
        </div>
        {spotlight && (
          <a
            className="pr-spotlight"
            href={spotlight.url}
            target="_blank"
            rel="noreferrer"
          >
            <span>
              SELECTED MERGED FIX / {spotlight.repository} #{spotlight.number}
            </span>
            <strong>{spotlight.title}</strong>
            <p>
              <b>Problem:</b> {prSpotlights[spotlight.id]}
            </p>
            <p>
              <b>Fix:</b> {prStoryDetails[spotlight.id]?.fix}
            </p>
            <p>
              <b>Tests:</b> {prStoryDetails[spotlight.id]?.tests}
            </p>
            <p className="pr-story-scope">
              <strong>Verification:</strong> Regression scenarios are described
              in the original PR. They were not independently rerun by this
              portfolio audit.
            </p>
            <span>
              Read the pull request <ArrowUpRight size={12} />
            </span>
          </a>
        )}
        <label className="search">
          <Search size={16} />
          <span className="sr-only">Search contributions</span>
          <input
            type="search"
            placeholder="Search contributions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          <span className="sr-only">Contribution state</span>
          <select value={state} onChange={(e) => setState(e.target.value)}>
            <option value="all">All states</option>
            <option value="merged">Merged</option>
            <option value="open">Open / under review</option>
            <option value="closed-unmerged">
              Closed / unmerged (not ingested)
            </option>
          </select>
        </label>
        <label>
          <span className="sr-only">Contribution scope</span>
          <select value={scope} onChange={(e) => setScope(e.target.value)}>
            <option value="external">Community contributions</option>
            <option value="all">Include own repositories</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Sort contributions</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>
      <p className="snapshot-note">
        {snapshot.lastVerifiedAt
          ? `Snapshot verified ${new Date(snapshot.lastVerifiedAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric" })}. Status may have changed since verification.`
          : "No verified snapshot yet. Browse contributions on GitHub."}
      </p>
      <div className="pr-groups" aria-live="polite">
        {state === "closed-unmerged" && (
          <p className="empty-state">
            This snapshot includes merged and open PRs. Closed-unmerged records
            have not been ingested and are never counted as merged.
          </p>
        )}
        {["merged", "open"]
          .filter((s) => state === "all" || state === s)
          .map((s) => {
            const items = filtered.filter((p) => p.state === s);
            return (
              <div className="pr-group" key={s}>
                <h3>
                  <span className={`status-dot ${s}`} />
                  {s === "merged" ? "Merged" : "Open · under review"}{" "}
                  <span className="count">{items.length}</span>
                </h3>
                {items.length === 0 ? (
                  <p className="empty-state">No matching {s} contributions.</p>
                ) : (
                  items.map((p) => (
                    <a
                      className="pr-row"
                      key={p.id}
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className={`pr-icon ${s}`}>
                        {s === "merged" ? (
                          <GitMerge size={19} />
                        ) : (
                          <GitPullRequest size={19} />
                        )}
                      </span>
                      <span className="pr-copy">
                        <span className="pr-meta">
                          {p.repository} <span>#{p.number}</span>
                          {!p.external && <span>Own repository</span>}
                        </span>
                        <strong>{p.title}</strong>
                        <span className="pr-date">
                          {p.mergedAt
                            ? `Merged ${p.mergedAt.slice(0, 10)}`
                            : `Opened ${p.createdAt.slice(0, 10)}`}
                          {featuredPrIds.includes(p.id) &&
                            " · Selected contribution"}
                        </span>
                      </span>
                      <ArrowUpRight size={17} />
                    </a>
                  ))
                )}
              </div>
            );
          })}
      </div>
    </section>
  );
}
