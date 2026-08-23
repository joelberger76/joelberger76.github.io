---
name: cmp
description: Commit all pending changes to develop, merge develop into main, and push both branches to origin. Use when the user types /cmp.
user-invocable: true
allowed-tools:
  - Bash(git status:*)
  - Bash(git diff:*)
  - Bash(git branch:*)
  - Bash(git log:*)
  - Bash(git add:*)
  - Bash(git commit:*)
  - Bash(git checkout:*)
  - Bash(git merge:*)
  - Bash(git push:*)
---

# /cmp — commit, merge, push

Ship the working copy: commit everything pending to `develop`, fast-forward
`main` to match, and push both to `origin`. This command exists specifically
so that invoking it *is* the user's explicit authorization for the merge and
push — the project's usual "don't merge to main / don't push until told"
rules don't apply when `/cmp` is what was typed. Nothing here needs a
confirmation prompt.

## Steps

1. **Get oriented.** Run `git status`, `git diff HEAD`, and
   `git branch --show-current` in parallel.

2. **Ensure `develop` is checked out.** If the current branch isn't
   `develop`, `git checkout develop` first. If it doesn't exist locally,
   stop and tell the user — don't create it from scratch.

3. **Commit pending changes, if any.**
   - If `git status` shows nothing to commit (clean tree, no untracked
     files), skip straight to step 4.
   - Otherwise stage everything, including untracked files
     (`git add -A`) — this command's whole point is "commit everything
     pending." Before staging, skim `git status` for anything that looks
     like a secret or credential file (`.env`, `*.pem`, credentials.json,
     etc.); if you see one, stop and ask rather than committing it.
   - Write a commit message the same way as any other commit in this repo:
     analyze the staged diff, summarize the *why* in 1-2 sentences, no em
     dashes, end with `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.
     If the diff spans several unrelated changes, one summary commit
     covering all of them is fine — this command is a single-shot wrap-up,
     not a place to agonize over commit granularity.
   - If a pre-commit hook fails, fix the underlying issue, re-stage, and
     commit again. Never `--no-verify`.

4. **Merge `develop` into `main`.**
   - `git checkout main`
   - `git merge develop`
   - This repo's history is linear, so this should fast-forward cleanly.
     If it doesn't (diverged history, conflicts), **stop**, leave the repo
     in whatever state git put it in, and report the conflict to the user
     instead of attempting to resolve it yourself.

5. **Push both branches.**
   - `git push origin main`
   - `git push origin develop`
   - Never force-push. If either push is rejected (remote has commits you
     don't have), stop and report it rather than force-pushing over it.

6. **Return to `develop`** (`git checkout develop`) so the working branch
   is back to normal when you're done.

7. **Report** what happened: what was committed (if anything), that main
   is now caught up to develop, and that both were pushed. Keep it short —
   a couple of sentences, not a full diff dump.

8. **End with "bash bash bash"** as the final line of your report, every
   time this command runs to completion.

## Edge cases

- Nothing pending *and* main already matches develop: say so, do nothing
  else, don't create an empty commit or a no-op push.
- Detached HEAD or a branch other than develop/main active with unrelated
  in-progress work: stop and ask rather than switching branches out from
  under it.
