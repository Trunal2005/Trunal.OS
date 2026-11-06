export function normalize(item, group) {
  if (item.user?.login !== "Trunal2005" || !item.pull_request) return null;
  const match = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)$/.exec(
    item.html_url,
  );
  if (!match || (group === "open" && item.state !== "open")) return null;
  const [, owner, repo, number] = match;
  if (group === "merged" && !item.pull_request.merged_at) return null;
  return {
    id: `${owner}/${repo}#${number}`,
    repository: `${owner}/${repo}`,
    number: Number(number),
    author: item.user.login,
    url: item.html_url,
    title: item.title,
    state: group,
    mergedAt: item.pull_request.merged_at ?? null,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    labels: (item.labels ?? []).map((l) => l.name),
    shortSummary: item.title,
    source: "GitHub REST Search API",
    lastVerifiedAt: new Date().toISOString(),
    external: owner.toLowerCase() !== "trunal2005",
  };
}
export function dedupe(items) {
  return [...new Map(items.map((i) => [i.id, i])).values()];
}
export function validatePage(data) {
  if (
    !Array.isArray(data.items) ||
    data.incomplete_results ||
    !Number.isInteger(data.total_count) ||
    data.total_count < 0 ||
    data.total_count > 1000
  )
    throw new Error("Incomplete or capped GitHub search; snapshot preserved");
  return data.items;
}
export async function collectPrs(getPage, pause) {
  const all = [];
  for (const group of ["merged", "open"]) {
    let received = 0;
    for (let page = 1; page <= 10; page++) {
      const data = await getPage(group, page);
      const items = validatePage(data);
      if (!items.length && received < data.total_count)
        throw new Error("Unexpected empty page; snapshot preserved");
      for (const item of items) {
        const pr = normalize(item, group);
        if (!pr) throw new Error(`Unverifiable PR ${item.html_url}`);
        all.push(pr);
      }
      received += items.length;
      if (page * 100 >= data.total_count) {
        if (received !== data.total_count)
          throw new Error("Result count changed; snapshot preserved");
        break;
      }
      await pause(6500);
    }
    await pause(6500);
  }
  return dedupe(all);
}
