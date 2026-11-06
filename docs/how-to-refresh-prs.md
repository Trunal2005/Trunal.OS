# Refresh verified contributions

Run `npm run sync:prs` locally with internet access. No token, account setup or paid service is required. It queries GitHub public REST Search separately with `author:Trunal2005 type:pr is:merged` and `author:Trunal2005 type:pr is:open`, 100 records per page. Official syntax: https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests . API contract: https://docs.github.com/en/rest/search/search . Rate limits: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api .

Merged requires non-null pull_request.merged_at; open requires exact state open. Author and safe canonical URL are validated; canonical repo/number identities dedupe. Partial results or the 1,000-search cap stop sync. Rate-limit responses stop immediately; temporary server failures have bounded exponential retries. Pagination is sequential with pauses. Failed sync returns nonzero and preserves the prior JSON. Successful writes use a temporary file and rename. No browser request is made.

Review `src/data/prs.generated.json`, then run tests and browser QA. Date labels identify the snapshot as historical. Own repositories are explicitly labeled and excluded from community counts by default. Selected highlights are curated only from verified records in `src/content/featured-prs.ts`.

No scheduled refresh exists. Do not update the submitted site between 15 November 2026, 23:59 IST and the officially announced results. Refresh locally after judging or with explicit owner instruction; a refresh does not push/deploy anything.
