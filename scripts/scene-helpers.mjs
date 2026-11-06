import assert from "node:assert/strict";
export const distance = (a, b) => Math.hypot(...a.map((v, i) => v - b[i]));
export async function settled(page, id = null) {
  // Hash navigation and React effects commit asynchronously, including detail
  // changes within the same district. Let that commit begin before polling.
  await page.waitForTimeout(180);
  await page.waitForFunction(
    (id) =>
      window.__TRUNAL_SCENE__?.flight === "settled" &&
      window.__TRUNAL_SCENE__.activePath === id,
    id,
    { timeout: 45000 },
  );
  await page.waitForTimeout(130);
  return page.evaluate(() => window.__TRUNAL_SCENE__);
}
export async function actualPick(page, id, beforeClick) {
  const points = await page.evaluate(
    (id) => window.__TRUNAL_SCENE__.points[id],
    id,
  );
  const canvas = page.locator(".immersive-canvas canvas");
  const bounds = await canvas.boundingBox();
  for (const point of points) {
    if (
      point.x < 30 ||
      point.x > bounds.width - 30 ||
      point.y < 130 ||
      point.y > bounds.height - 155
    )
      continue;
    await page.mouse.move(point.x, point.y);
    await page.waitForTimeout(55);
    if (
      (await page.locator(".immersive-canvas").getAttribute("data-hover")) !==
      (id.startsWith("project-")
        ? "projects"
        : id.startsWith("skill-")
          ? "skills"
          : id.startsWith("stage-")
            ? "experience"
            : id.startsWith("pr-")
              ? "opensource"
              : id)
    )
      continue;
    const previous = await page.evaluate(
      () => window.__TRUNAL_SCENE__.picks.length,
    );
    if (
      /^(project-|skill-|stage-|pr-)/.test(id) &&
      (await page
        .locator(".immersive-canvas")
        .getAttribute("data-detail-hover")) !== id
    )
      continue;
    if (beforeClick) await beforeClick(point);
    await page.mouse.click(point.x, point.y);
    await page.waitForFunction(
      ({ id, previous }) =>
        window.__TRUNAL_SCENE__.picks.slice(previous).some((p) => p.id === id),
      { id, previous },
      { timeout: 5000 },
    );
    return point;
  }
  assert.fail(`No visible physical mesh could be picked for ${id}`);
}
