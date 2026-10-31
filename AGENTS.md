<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Legacy family-facing routes outside the approved experience map keep their files but redirect in `beforeLoad` (see `src/features/space/__tests__/legacy-redirects.test.ts`); why: direct old links must never render retired UI, and code/data stay recoverable.
- `/space/participations` is the single family participations surface (drafts, cards, today log, history); `/space`, `/active-participations` and `/my-routine` redirect to it; why: no competing lists.
