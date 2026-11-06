# Add a skill

1. Edit `src/content/skills.ts`. Choose an existing category: frontend, backend, ai, data, tools or networks. New records automatically appear in that pod's HTML panel and in Show all skills; no geometry edit is required.
2. Use the `used()` helper only when a public repository documents the tool. Supply valid project IDs and an accurate application description. `verified` here means repository-documented use, not an independently executed benchmark or expertise rating.
3. Use `listed()` for résumé-only learning, with `concept=true` for concepts explored. Leave evidence IDs empty until established. Hide an unsupported record instead of implying proficiency.
4. Check the corresponding repository and update internal provenance. Run the checks in `CONTENT_EDITING_GUIDE.md`, then review desktop and mobile category selection and evidence links.

Adding another technology to a category does not add a new top-level district. Avoid logo walls, percentage mastery and invented experience durations.
