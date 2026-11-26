<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- All user data (profile, portfolio, applications, mentorship requests) lives in browser localStorage via `src/lib/store.ts` (useSyncExternalStore, empty server snapshot); the user asked for on-device storage with no backend.
- Pages that render stored data gate on `useHydrated()` so SSR and first client render match.
- Demo listings, mentors, and baseline counts live in `src/lib/demo-data.ts`; real user counts (`computeUserStats`) and demo counts (`DEMO_STATS`) in `src/lib/stats.ts` are never summed, so real activity is never mixed with sample figures.
- Evidence status (Self-Reported / Evidence Provided / Partner Verified) is derived in `src/lib/evidence.ts`; Partner Verified requires a partner record the app never writes itself, so the app cannot claim verification.
- Brand colors are semantic tokens in `src/styles.css` (navy, teal, demo); never hardcode color utilities.
- Backup controls share a versioned, allowlisted schema in `src/lib/backup.ts`; omit partner verification and unknown fields so imported files cannot grant trust or inject unsupported data.
- Restore replaces local state only after localStorage writes successfully and explicit user confirmation; this prevents duplicates and preserves current data on storage failure.
