---
name: review-upstream
description: Review new commits on the upstream career-portfolio-template repo since the last sync, propose which are worth porting into this fork, and implement the ones the user approves. Use when the user asks to check upstream, sync with the template project, see what's new on the template, or pull in updates from career-portfolio-template.
user-invocable: true
---

# /review-upstream — review and port changes from the upstream template

This site started from `nbakh16/career-portfolio-template` and has since
diverged (different theming, data structure, content, and several
site-specific features like GoatCounter analytics and a custom domain). The
upstream repo still gets useful fixes and small features. This skill finds
what's new since the last sync, filters it down to things actually worth
having, proposes them to the user, and ports the approved ones — adapted to
this repo's structure, not blindly cherry-picked.

State from the last run lives in `.claude/skills/review-upstream/state.json`
(checked into git, so it persists across machines).

## Steps

1. **Get oriented.** In parallel: read `.claude/skills/review-upstream/state.json`
   for the `last_synced_sha` and `branch`, and run `git remote -v` to confirm
   the `template` remote exists (pointing at
   `https://github.com/nbakh16/career-portfolio-template.git`). If the remote
   is missing, add it: `git remote add template <url>`.

2. **Fetch.** `git fetch template`.

3. **Diff the range.** `git log <last_synced_sha>..template/<branch> --oneline`
   to list what's new. If there's nothing new, tell the user the fork is
   already caught up (referencing the last synced SHA and date) and stop —
   don't re-review the same range twice.

4. **Review each new commit.** For each one, `git show` it (or `git diff
   <last_synced_sha> template/<branch> -- <touched paths>` for a combined
   view across a series of related commits) to understand the actual change,
   not just the message. Skip anything upstream marked as a merge commit with
   no unique content of its own.

5. **Filter for what's actually worth porting.** Judge each candidate change
   against this fork's context, not upstream's:
   - Bug fixes, accessibility improvements, and small robustness fixes are
     usually worth it regardless of theming differences.
   - Cosmetic/branding changes (upstream's own name, demo content, colors,
     README wording) are not relevant here — skip them.
   - Features that assume upstream's exact data shape or component structure
     need to be checked against this repo's current version of those files
     (see `CLAUDE.md` for how data/components are wired here) before deciding
     they're portable as-is.
   - When in doubt about whether something is a fit, lean toward including it
     in the proposal and let the user decide rather than silently dropping it.

6. **Propose, don't implement yet.** Present the filtered list to the user:
   one or two lines per item (what it is, why it's worth having or notable),
   grouped by rough theme if there are several (a11y, bug fixes, features).
   Ask which ones to bring in — don't assume "all of them" or "none of them."
   Use AskUserQuestion if a compact multiple-choice framing fits; otherwise
   plain text is fine for an open-ended list.

7. **Implement the approved changes.** Adapt each one to this repo's current
   files rather than pasting upstream's diff verbatim — this fork's
   components, data schema, and styling have moved on from upstream's. Follow
   this repo's own conventions (see `CLAUDE.md`), not upstream's.

8. **Update the sync marker.** Once the user is satisfied with what's been
   ported (whether that's everything proposed or a subset), rewrite
   `.claude/skills/review-upstream/state.json` with the new `last_synced_sha`
   (the current `template/<branch>` tip from step 2) and today's date. Do
   this even if the user declined every proposed change — it means "already
   reviewed," not "already ported," so the same commits aren't re-proposed
   next time. Mention in the commit/summary which upstream commits were
   reviewed but declined, so that decision isn't silently lost.

9. **Commit, if asked.** This repo's rule is commit only when the user asks
   (see `CLAUDE.md`) — don't commit automatically just because this skill
   ran. If/when committing, follow the same style as past upstream-port
   commits (e.g. `2d0e3f9`): a short summary of what was ported and why it
   was worth bringing in, ending with
   `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`, no em dashes.
   Commit the updated `state.json` alongside the ported changes.

## Notes

- This is a review-and-propose skill, not an auto-merge. Never run
  `git merge template/<branch>` — the two repos have diverged too far for
  that to make sense; everything goes through the manual adapt-and-port
  process above.
- If the user wants to see the raw diff for something before deciding,
  `git diff <last_synced_sha> template/<branch> -- <path>` or `git show
  <sha>` is fine to run and show them directly.
