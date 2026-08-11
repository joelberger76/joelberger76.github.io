# TODO

Pending polish items for this portfolio site. Tracked here (instead of only in Claude's memory) so it's visible across every machine this repo is checked out on. Remove an item once it's actually implemented — don't just mark it done in prose.

- Switch `origin` remote from HTTPS to SSH key auth. Currently uses `credential.helper = osxkeychain`, which can't show its GUI prompt over a headless SSH session (e.g. connecting to this Mac remotely via SSH), so `git push` hangs/fails when not physically at the machine. Fix: add an SSH key with `UseKeychain yes` / `AddKeysToAgent yes` in `~/.ssh/config`, add the public key to GitHub, then repoint origin to `git@github.com:joelberger76/joelberger76.github.io.git`. Confirmed this won't break Tower, it reads the same system ssh-agent.

