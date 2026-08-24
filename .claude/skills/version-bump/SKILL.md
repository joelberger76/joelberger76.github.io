---
name: version-bump
description: Check for outdated npm dependencies, update the safe in-range ones, and confirm with the user before doing anything riskier (major/out-of-range bumps, npm audit fix). Use when the user asks to check for dependency updates, bump versions, or types /version-bump.
user-invocable: true
allowed-tools:
  - Bash(npm outdated:*)
  - Bash(npm update:*)
  - Bash(npm audit:*)
  - Bash(npm run build:*)
  - Bash(git status:*)
  - Bash(git diff:*)
---

# /version-bump — cautious dependency updates

Surface outdated npm dependencies, update the ones that are low-risk, and
stop to confirm with the user before touching anything that carries real
risk (major-version jumps, security-driven forced upgrades). This skill
never commits or pushes on its own — see `CLAUDE.md`'s "only commit when
asked" rule.

## Steps

1. **Survey.** Run `npm outdated`. It exits non-zero when anything is
   outdated — that's expected, not a failure. For each package, compare
   `Current` to `Wanted` and `Latest`:
   - `Current == Wanted < Latest`: within the existing `^`/`~` range in
     `package.json`, `npm update` will pick it up safely.
   - `Wanted == Latest` and it differs from `Current`: also in-range,
     same treatment.
   - `Current == Wanted == Latest`: nothing to do for that package.
   - `Wanted` unreachable / `Latest` is a different major version than
     `Current`: out of range on purpose — `npm update` won't touch it,
     and it needs a manual `package.json` edit to move.

2. **Classify each outdated package.**
   - **Safe (in-range):** `Wanted` differs from `Current` — minor/patch
     bump within the caret range already declared in `package.json`.
   - **Risky (out-of-range):** `Latest` is a major-version jump above
     `Wanted`, or the package is a framework/toolchain-critical dependency
     (Astro, TypeScript, Tailwind, build plugins) even for a minor bump if
     it's known to carry breaking changes. When unsure whether something
     counts as risky, err toward flagging it rather than silently
     including it in the safe batch.

3. **Report the split before doing anything**, e.g.:
   - Safe: package name, current → wanted version, one line each.
   - Risky: package name, current → latest, and *why* it's flagged
     (major version jump, known rewrite/breaking-change, core toolchain
     dependency, etc).
   Don't run any update yet — this is a report, not an action.

4. **Update the safe ones**, but only after telling the user what they are
   — a brief "here's what I'm about to update" is enough, this doesn't
   need a full confirmation prompt since it's low-risk and reversible via
   git. Run `npm update <pkg> <pkg> ...` naming the safe packages
   explicitly (not a bare `npm update`, so a package that became risky
   between survey and action can't slip through). `package.json` itself
   shouldn't change for these — only `package-lock.json`. If
   `package.json` changes anyway, stop and look at why before continuing.

5. **For risky packages, stop and ask.** Use AskUserQuestion or plain text
   to lay out the tradeoff for each one: what's new, what's likely to
   break, and whether it's worth doing now versus waiting. Never bump a
   major version or a flagged toolchain dependency without the user
   explicitly choosing to proceed. If they decline, leave it exactly as
   reported so a future run surfaces it again rather than silently
   forgetting it was flagged.

6. **Check for security advisories.** Run `npm audit`. If it reports
   vulnerabilities:
   - If `npm audit fix` (non-forced) can resolve them without a major
     bump, summarize what it would change (package, severity, advisory)
     and confirm with the user before running it — even though it's
     labeled "fix," treat it with the same caution as any other
     dependency change.
   - If a fix requires `npm audit fix --force` (major version bump),
     treat it as a risky package per step 5: report the severity and the
     breaking-change risk, and let the user decide. Never pass `--force`
     without explicit confirmation.

7. **Verify.** After any update (safe batch and/or confirmed risky ones),
   run `npm run build` to confirm the project still builds. If it fails,
   report the failure and don't paper over it — investigate or let the
   user decide whether to revert (`git checkout -- package.json
   package-lock.json`) rather than leaving a broken lockfile in place.

8. **Report** what changed: which packages were bumped and to what
   versions, whether the build passed, and which flagged/risky packages
   are still outstanding (so nothing risky is silently dropped from the
   user's radar). Don't stage, commit, or push — that's a separate,
   explicit ask per this repo's conventions.

## Edge cases

- `npm outdated` reports nothing: say so, nothing to do.
- Everything outdated is risky (no safe batch): skip straight to step 5,
  don't invent a no-op "safe update ran" step.
- User approves only some of the risky packages: update just those,
  named explicitly, and report the rest as still outstanding.
- `npm audit` reports 0 vulnerabilities: mention it briefly, no action
  needed.
