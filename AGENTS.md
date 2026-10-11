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

## Portfolio architecture
- Keep the founder portfolio on the public index with section anchors to match the explicitly requested scrolling navigation.
- Keep inquiry validation shared and perform private inquiry inserts in a public server function with no visitor read path.
- Define semantic dark-theme tokens centrally in the global stylesheet to keep portfolio presentation consistent.
- Reject outdated Vite dependency requests so clients reload after dependency changes instead of mixing React runtime generations.
