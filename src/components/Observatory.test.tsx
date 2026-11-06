import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Observatory from "./Observatory";
import data from "../data/prs.generated.json";
describe("PR observatory evidence rendering", () => {
  it("shows no numerical claim before any successful snapshot", () => {
    const html = renderToStaticMarkup(
      <Observatory data={{ lastVerifiedAt: null, items: [] }} />,
    );
    expect(html).toContain("No verified snapshot yet");
    expect(html).not.toContain('class="pr-totals"');
  });
  it("labels historical evidence instead of claiming live status", () => {
    const html = renderToStaticMarkup(
      <Observatory data={{ ...data, lastVerifiedAt: "2020-01-01" }} />,
    );
    expect(html).toContain("2020");
    expect(html).toContain("Status may have changed");
  });
  it("escapes an upstream title with HTML and script content", () => {
    const title = '<script>alert("xss")</script>';
    const html = renderToStaticMarkup(
      <Observatory data={{ ...data, items: [{ ...data.items[0], title }] }} />,
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
