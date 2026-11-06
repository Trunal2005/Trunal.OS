import { describe, it, expect } from "vitest";
// @ts-expect-error The sync module intentionally also runs directly under Node.
import { normalize, dedupe, validatePage, collectPrs } from "./pr-utils.mjs";
const item = {
  user: { login: "Trunal2005" },
  pull_request: { merged_at: "2026-11-01T00:00:00Z" },
  html_url: "https://github.com/example/upstream/pull/12",
  title: "<img src=x onerror=alert(1)>",
  state: "closed",
  created_at: "2026-10-30",
  updated_at: "2026-11-01",
  labels: [],
};
describe("GitHub snapshot ingestion", () => {
  it("collects every page and both states without requesting a token", async () => {
    const calls: string[] = [];
    const result = await collectPrs(
      async (group: string, page: number) => {
        calls.push(`${group}/${page}`);
        if (group === "open") return { items: [], total_count: 0 };
        return {
          items: Array.from({ length: page === 1 ? 100 : 1 }, (_, i) => ({
            ...item,
            html_url: `https://github.com/example/upstream/pull/${(page - 1) * 100 + i + 1}`,
          })),
          total_count: 101,
        };
      },
      async () => {},
    );
    expect(calls).toEqual(["merged/1", "merged/2", "open/1"]);
    expect(result).toHaveLength(101);
  });
  it("rejects truncated pages and stops when GitHub fails", async () => {
    await expect(
      collectPrs(
        async () => ({ items: [], total_count: 1 }),
        async () => {},
      ),
    ).rejects.toThrow("empty page");
    await expect(
      collectPrs(
        async () => {
          throw new Error("rate limit");
        },
        async () => {},
      ),
    ).rejects.toThrow("rate limit");
  });
  it("verifies exact author and PR identity", () => {
    expect(
      normalize({ ...item, user: { login: "impostor" } }, "merged"),
    ).toBeNull();
    expect(normalize({ ...item, pull_request: null }, "merged")).toBeNull();
    expect(
      normalize({ ...item, html_url: "javascript:alert(1)" }, "merged"),
    ).toBeNull();
  });
  it("rejects closed unmerged PRs", () =>
    expect(
      normalize({ ...item, pull_request: { merged_at: null } }, "merged"),
    ).toBeNull());
  it("rejects closed PRs in the open group", () =>
    expect(normalize(item, "open")).toBeNull());
  it("preserves external text as data, never HTML", () =>
    expect(normalize(item, "merged").title).toBe(item.title));
  it("dedupes canonical identities", () => {
    const pr = normalize(item, "merged");
    expect(dedupe([pr, pr])).toHaveLength(1);
  });
  it("handles empty pages and rejects partial or capped searches", () => {
    expect(validatePage({ items: [], total_count: 0 })).toEqual([]);
    expect(() =>
      validatePage({ items: [], incomplete_results: true }),
    ).toThrow();
    expect(() => validatePage({ items: [], total_count: 1001 })).toThrow();
    expect(() => validatePage({ message: "rate limit" })).toThrow();
  });
});
