---
name: pull-branches
description: Pull the latest changes on both main and develop from origin, safely stashing and restoring any pending local work (including untracked files), and leave the repo checked out on develop. Use when the user asks to pull, sync branches with origin, or types /pull-branches.
user-invocable: true
allowed-tools:
  - Bash(git status:*)
  - Bash(git diff:*)
  - Bash(git branch:*)
  - Bash(git stash:*)
  - Bash(git add:*)
  - Bash(git checkout:*)
  - Bash(git pull:*)
---

# /pull-branches — sync main and develop from origin

Update both long-lived branches from `origin` without losing or scattering
any in-progress local work, and end up back on `develop`.

## Steps

1. **Get oriented.** Run `git status --porcelain` and
   `git branch --show-current` in parallel. Remember the current branch as
   `$original_branch` — this is where any stashed work will be restored.

2. **Stash pending changes, if any.**
   - If `git status --porcelain` is empty, skip to step 3 — nothing to
     stash.
   - Otherwise, stage untracked files first so they're included in the
     stash: `git add -A`. (Plain `git stash` ignores untracked files, and
     leaving them untracked can also cause `git pull` to fail later with
     "untracked working tree files would be overwritten by merge" if an
     incoming file collides with one.)
   - Stash everything with a distinctive, greppable message so it can be
     found precisely later even if other stashes already exist:
     `git stash push -m "pull-autostash"`.
   - Note that a stash now exists and needs to be restored before this
     skill finishes.

3. **Pull `main`.**
   - `git checkout main`
   - `git pull --ff-only origin main`
   - If the branch doesn't exist locally, or the pull fails (diverged
     history, conflicts, no `--ff-only` possible), stop pulling further,
     jump to step 5 to restore any stash, and then report the problem
     instead of trying to force it through.

4. **Pull `develop`.**
   - `git checkout develop`
   - `git pull --ff-only origin develop`
   - Same failure handling as step 3: stop, restore the stash (step 5),
     then report.

5. **Restore the stash, if one was created.**
   - Check out `$original_branch` (if it isn't already checked out).
   - Find the exact stash by message rather than assuming it's
     `stash@{0}`: `git stash list` and locate the entry containing
     `pull-autostash`.
   - Pop that specific stash, e.g.
     `git stash pop "stash^{/pull-autostash}"`.
   - If the pop applies cleanly, the stash is gone — no stray stash left
     behind. If it conflicts, **stop**: leave the stash in place (do not
     drop it), leave the conflict markers for the user to resolve, and
     report exactly what happened. Never discard a stash that failed to
     apply.

6. **End on `develop`.** If `$original_branch` wasn't `develop`, check it
   out now (`git checkout develop`) so the repo is left on develop
   regardless of where it started. This is a plain checkout of an already
   up-to-date clean branch, not a merge or reset.

7. **Report** concisely: whether local changes were stashed/restored,
   whether `main` and `develop` were already up to date or pulled new
   commits, and confirm the repo is back on `develop` with a clean tree.

## Edge cases

- **Nothing to stash and both branches already up to date:** say so
  briefly, no extra steps needed.
- **`$original_branch` is `main` or `develop`:** no special-casing needed,
  the steps above already handle it (you'll just check it out again as
  part of the normal flow).
- **Pull fails on `main` or `develop` due to diverged/local commits not on
  origin:** stop, restore the stash per step 5, and report the divergence
  to the user rather than force-pushing, resetting, or merging on their
  behalf.
- **Stash pop conflicts:** stop immediately after the failed pop, don't
  attempt to auto-resolve, and don't run `git stash drop`. Tell the user
  which files conflicted and that their stash is still saved.
