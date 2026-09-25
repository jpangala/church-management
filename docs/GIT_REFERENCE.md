# Git & GitHub Reference

Every word and every command you'll meet on this project, explained once, properly.

**This is a lookup file, not a tutorial — you are not meant to read it top to bottom.**
Working through your first task? Use [`ONBOARDING.md`](ONBOARDING.md) instead, and come
back here whenever it uses a word you don't know. Setting up conventions? That's
[`CONTRIBUTING.md`](../CONTRIBUTING.md). Debugging a red check on your PR? That's
[`CI_GUIDE.md`](CI_GUIDE.md).

Jump to: [The words](#part-1--the-words) · [The commands](#part-2--the-commands) ·
[The full loop](#part-3--the-full-loop-for-this-repo) · [Reading Git's output](#part-4--reading-what-git-tells-you) ·
[Fixing mistakes](#part-5--fixing-mistakes-safely) · [Ask first](#part-6--commands-that-need-a-second-opinion) ·
[gh CLI](#part-7--the-gh-cli) · [Project commands](#part-8--this-projects-own-commands) ·
[Cheat sheet](#cheat-sheet)

---

## Part 1 — The words

### Where things live

| Word                             | What it actually is                                                                                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Repository** ("repo")          | The project folder _plus_ its complete history. There's one on GitHub and a full copy on each of your laptops — Git is distributed, so your copy isn't a partial view, it's the whole thing.           |
| **Remote**                       | A copy of the repo that lives somewhere else, referred to by a nickname.                                                                                                                               |
| **`origin`**                     | The default nickname for _our_ GitHub copy: `https://github.com/jpangala/church-management`. When you read `origin/dev`, that means "the `dev` branch as it looked on GitHub the last time I checked." |
| **Working tree**                 | The actual files on your disk right now, the ones your editor opens.                                                                                                                                   |
| **Staging area** ("index")       | A holding pen between your working tree and a commit. You put changes here with `git add` to say "this batch goes in the next commit" — it's what lets you commit 2 of your 5 changed files.           |
| **`HEAD`**                       | A pointer to where you are right now. Usually it means "the tip of the branch I have checked out."                                                                                                     |
| **Tracking branch** ("upstream") | The remote branch your local branch is paired with. It's why plain `git pull` knows where to pull _from_. Set on first push with `-u`.                                                                 |

### Things you make

| Word             | What it actually is                                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Commit**       | A permanent, named snapshot of the whole project at one moment, plus a message saying why. Not a diff — a full snapshot, though Git stores it efficiently. |
| **Hash** ("SHA") | A commit's unique ID, like `c94444f86e2b...`. The first 7 characters (`c94444f`) are enough to refer to it.                                                |
| **Branch**       | A movable label pointing at a commit. That's genuinely all it is — which is why making one is instant and free, and why you should make them freely.       |
| **Diff**         | The line-by-line difference between two things. What you review on a PR.                                                                                   |
| **Conflict**     | Two people changed the same lines of the same file, and Git refuses to guess which wins. You pick, by hand. Normal; not a sign you broke anything.         |
| **Lockfile**     | `pnpm-lock.yaml` — records the exact version of every dependency so all four of us install byte-identical packages. Commit it whenever it changes.         |

### Things you do

| Word              | What it actually is                                                                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Clone**         | Download a repo for the first time. Once per laptop, ever.                                                                                                              |
| **Fetch**         | Download what's new on GitHub, but _don't_ touch your files. Safe, always.                                                                                              |
| **Pull**          | Fetch **and** merge it into your current branch. Changes your files. `pull` = `fetch` + `merge`.                                                                        |
| **Stage** ("add") | Mark changes to go into the next commit.                                                                                                                                |
| **Push**          | Upload your commits to GitHub.                                                                                                                                          |
| **Merge**         | Combine another branch's work into yours, creating a commit that has two parents.                                                                                       |
| **Rebase**        | Replay your commits on top of a newer base, rewriting them in the process. Powerful, and rewrites history — see [Part 6](#part-6--commands-that-need-a-second-opinion). |
| **Squash**        | Collapse several commits into one. How feature branches enter `dev` here.                                                                                               |
| **Cherry-pick**   | Copy one specific commit onto the branch you're on.                                                                                                                     |
| **Stash**         | Temporarily shelve uncommitted changes so you can switch branches, then bring them back.                                                                                |
| **Revert**        | Undo a commit by making a _new_ commit that reverses it. Safe, because it adds history rather than deleting it.                                                         |
| **Reset**         | Move your branch pointer to a different commit. `--hard` also discards your file changes. Dangerous.                                                                    |

### GitHub-specific

| Word                      | What it actually is                                                                                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pull Request** ("PR")   | A request to merge one branch into another, with review and automated checks in between. The unit of work on this team — nothing reaches `dev` or `main` any other way. |
| **Review**                | A teammate reading your diff and leaving _Approve_, _Comment_, or _Request changes_.                                                                                    |
| **Status check**          | An automated job that must pass before merge. Ours is named **`verify`**.                                                                                               |
| **CI**                    | "Continuous Integration" — the machine that runs those checks. Ours is GitHub Actions, defined in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).            |
| **Branch protection**     | GitHub rules on `main` and `dev`: no direct pushes, no force-pushes, no deletion, PR required, `verify` must be green.                                                  |
| **CODEOWNERS**            | [`.github/CODEOWNERS`](../.github/CODEOWNERS) — maps folders to the person responsible for them. Touch someone's folder and GitHub requests their review automatically. |
| **Draft PR**              | A PR explicitly marked "not ready." CI still runs; the merge button stays off. Good for early feedback.                                                                 |
| **Squash and merge**      | Merge style that flattens your branch into one commit on the target. **What we use for `feat/*` → `dev`.**                                                              |
| **Create a merge commit** | Merge style that preserves every commit and adds a merge commit. **What we use for `dev` → `main`**, so `main`'s history shows what shipped per sprint.                 |

### Words specific to this repo

| Word                                       | Meaning here                                                                                                                                                                                                 |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`main`**                                 | Deployable. Protected. Only ever receives `dev`, once per sprint, from the lead.                                                                                                                             |
| **`dev`**                                  | Integration branch. Protected. Every feature PR targets this.                                                                                                                                                |
| **`feat/<domain>-<thing>`**                | Your branch. One per task, short-lived, deleted after merge. Also `fix/...` and `chore/...` and `docs/...`.                                                                                                  |
| **`verify`**                               | The single required CI job: install → prisma generate → lint → typecheck → test → build.                                                                                                                     |
| **"Strict" / "branch must be up to date"** | Turned **on** here. If anyone merges into `dev` while your PR is open, yours goes stale and you must merge `dev` back into your branch before GitHub will let you merge. Expect this often with four people. |
| **Domain**                                 | Your lane: Identity & Access, Members & Projects, Bookings & Assets, or Finance. It decides your CODEOWNERS slice and your commit scope.                                                                     |

---

## Part 2 — The commands

Every command this project actually uses. `<angle brackets>` mean "replace this."

### Setting up, once per laptop

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Stamps your identity onto every commit you make. Use the email tied to your GitHub
account, or your commits won't link to your profile.

```bash
git clone git@github.com:jpangala/church-management.git
```

Downloads the repo into a new folder named `church-management`, with full history, and
sets up `origin` automatically. Use the `https://github.com/...` URL instead if you set
up GitHub Desktop rather than SSH keys.

### Looking around — all of these are safe, none change anything

```bash
git status
```

The single most useful command in Git. What branch you're on, what's changed, what's
staged, whether you're ahead of or behind GitHub. **Run it constantly.** Add `-sb` for a
compact version.

```bash
git log --oneline -10
```

The last 10 commits, one line each. Add `--graph --all --decorate` to see every branch as
a diagram — that's how the branch structure in this repo was mapped.

```bash
git diff
```

What you've changed but haven't staged yet. `git diff --staged` shows what you _have_
staged. `git diff dev` compares your whole branch against `dev`.

```bash
git branch -vv
```

Your local branches, the commit each points at, and how far ahead/behind its remote each
one is. `git branch -r` shows remote branches instead.

```bash
git show <hash>
```

The full contents of one commit. `git show <hash> --stat` shows just the file list.
`git show <hash>:<path/to/file>` prints that file as it was in that commit — which is how
you read a file that only exists on some other branch.

### The everyday cycle

```bash
git checkout dev
```

Switch to the `dev` branch. Your files change to match it. Git refuses if you have
uncommitted work that would be overwritten — commit or `stash` first.

```bash
git pull
```

Fetch GitHub's latest and merge it into your current branch. **Always do this on `dev`
before branching**, so you start from your teammates' newest work rather than from
last Tuesday.

```bash
git checkout -b feat/finance-budget-crud
```

Create a new branch _and_ switch to it, starting from wherever you are. The `-b` is
"branch." This is why step 1 matters: the branch inherits whatever you were standing on.

```bash
git add apps/api/src/finance/finance.service.ts
```

Stage one specific file. `git add .` stages everything changed — convenient, but look at
`git status` first so you don't sweep in a stray debug file.

```bash
git commit -m "feat(finance): add budget CRUD endpoints"
```

Save the staged changes as a commit. The message format is not decoration — see
[`CONTRIBUTING.md`](../CONTRIBUTING.md). `git commit -am "..."` stages all _already-tracked_
modified files and commits in one step (it will not pick up brand-new files).

```bash
git push -u origin feat/finance-budget-crud
```

Upload your branch to GitHub. The `-u` links local to remote so that every later push on
this branch is just `git push`. Use `-u` on the first push of a branch, never after.

```bash
git push
```

Every subsequent push on a branch that's already linked.

### Staying in sync with four people

```bash
git fetch
```

Update your knowledge of what's on GitHub without touching your files. Safe to run any
time you're unsure.

```bash
git log HEAD..origin/dev --oneline
```

"What's on `dev` that I don't have?" Empty output means you're current.

```bash
git merge origin/dev
```

Pull `dev`'s newer commits into your feature branch. **This is the fix for "branch is out
of date" on your PR.** Run it, resolve any conflicts, then `git push` again.

```bash
git checkout -- <file>
```

Throw away your uncommitted changes to one file, restoring it to the last commit. Cannot
be undone — there's no saved copy to recover.

### Wrapping up

```bash
git branch -d feat/finance-budget-crud
```

Delete a merged local branch. Lowercase `-d` refuses if the branch isn't merged yet, which
is a safety feature, not an obstacle. GitHub offers a button to delete the remote copy
right after merging.

---

## Part 3 — The full loop, for this repo

One task, start to finish. This is the sequence you'll repeat for the rest of the project.

```bash
# 1. Start from everyone else's latest work — never skip this
git checkout dev
git pull

# 2. Branch. Name it <type>/<domain>-<thing>
git checkout -b feat/finance-budget-crud

# 3. ... write code in your editor ...

# 4. See what you did
git status
git diff

# 5. Run exactly what CI will run. Fix anything red BEFORE pushing
pnpm lint && pnpm typecheck && pnpm test && pnpm build

# 6. Stage and commit
git add apps/api/src/finance/finance.service.ts
git commit -m "feat(finance): add budget CRUD endpoints"

# 7. Push (first push on this branch, hence -u)
git push -u origin feat/finance-budget-crud

# 8. Open the PR — note --base dev
gh pr create --base dev --fill
```

Then, on GitHub: fill in the template honestly (especially _"How I tested it"_ — "CI is
green" is not an answer), wait for `verify` to go green, get one approval,
**Squash and merge**, delete the branch.

**If `dev` moved while your PR was open** — likely, with four people — GitHub will block
the merge as out of date:

```bash
git fetch
git merge origin/dev
# resolve conflicts if Git reports any, then:
git push
```

Two rules worth memorising, because they're where this team has already slipped:

1. **`--base dev`, never `--base main`.** GitHub's dropdown defaults to `main`. The only
   PR that ever targets `main` is the lead's sprint promotion.
2. **Never commit directly on `dev` or `main`.** If `git status` says you're on either one
   and you have changes, stop and move them to a branch — see
   [Part 5](#part-5--fixing-mistakes-safely).

---

## Part 4 — Reading what Git tells you

**"Your branch is ahead of 'origin/dev' by 2 commits."**
You have 2 commits GitHub hasn't seen. `git push`.

**"Your branch is behind 'origin/dev' by 5 commits."**
GitHub has 5 you don't. `git pull`.

**"Your branch and 'origin/dev' have diverged."**
You both have commits the other lacks. A plain pull won't fast-forward. Usually
`git merge origin/dev` (or ask the lead). This is exactly the state local `main` is in
today.

**"Untracked files"**
New files Git has never seen. They won't be committed until you `git add` them. If
something you expected to commit is missing, this is usually why.

**"Changes not staged for commit"**
Modified, but not yet `git add`ed. `git commit -am` will catch these; plain `git commit`
won't.

**"CONFLICT (content): Merge conflict in `<file>`"**
Two people edited the same lines. Open the file and you'll find:

```
<<<<<<< HEAD
your version
=======
their version
>>>>>>> origin/dev
```

Delete the markers, keep the correct result (sometimes both sides, sometimes neither
verbatim), then `git add <file>` and `git commit`. Ask if you're unsure which side is
right — guessing wrong silently deletes a teammate's work.

**"HEAD detached at `<hash>`"**
You checked out a commit rather than a branch. Commits here belong to no branch and are
easy to lose. `git checkout dev` gets you back.

**"Updates were rejected because the remote contains work that you do not have"**
Someone pushed to your branch since you last pulled. `git pull`, then push again. Do
**not** reach for `--force`.

**"! [remote rejected] ... protected branch hook declined"**
You tried to push straight to `main` or `dev`. Working as designed — put your work on a
branch and open a PR.

---

## Part 5 — Fixing mistakes safely

Every one of these is non-destructive.

**Wrong commit message, not pushed yet:**

```bash
git commit --amend -m "feat(finance): the correct message"
```

**Forgot a file in the last commit, not pushed yet:**

```bash
git add the-missing-file.ts
git commit --amend --no-edit
```

**You committed on `dev` or `main` by accident** (the most common beginner mistake here —
your commits are safe, they just need a home):

```bash
git branch feat/my-work        # bookmark the commits on a new branch
git reset --hard origin/dev    # put dev back to match GitHub
git checkout feat/my-work      # your work, now on its own branch
```

**You need to switch branches but aren't ready to commit:**

```bash
git stash
git checkout dev
# ... later, back on your branch ...
git stash pop
```

**Undo a commit that's already merged and pushed** — the safe way, because it adds history
rather than rewriting it:

```bash
git revert <hash>
```

**You want a specific commit from another branch:**

```bash
git cherry-pick <hash>
```

**You genuinely lost something.** Git almost never deletes commits outright. This lists
everywhere `HEAD` has been for the last 90 days, including commits no branch points at:

```bash
git reflog
```

Find the hash, then `git checkout -b rescue <hash>`.

---

## Part 6 — Commands that need a second opinion

Not forbidden — but on a shared repo, ask the lead before running these. Each one can
destroy work that isn't yours.

| Command            | Why it's risky                                                                                                                                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `git push --force` | Overwrites GitHub's history. If a teammate pulled the old version, their repo is now broken. Blocked on `main` and `dev` here, but _not_ on your feature branch. `--force-with-lease` is the safer variant if you truly need it. |
| `git reset --hard` | Discards uncommitted work permanently. No undo — the changes were never committed, so `reflog` can't help.                                                                                                                       |
| `git rebase`       | Rewrites commits. Fine on a branch only you have touched; destructive once someone else has pulled it.                                                                                                                           |
| `git clean -fd`    | Deletes untracked files and folders from disk, including any `.env` you haven't backed up.                                                                                                                                       |
| `git branch -D`    | Capital `D` forces deletion of an unmerged branch, skipping the safety check.                                                                                                                                                    |

The rule: **if you're not sure, ask before running it.** A question costs a minute;
a force-push costs the team an afternoon.

---

## Part 7 — The `gh` CLI

GitHub's official command line tool. Optional, but it saves a lot of browser round-trips.
Install with `brew install gh`, then `gh auth login` once.

```bash
gh pr create --base dev --fill
```

Open a PR from your current branch into `dev`. `--fill` uses your commit message as the
title and body. Drop `--fill` to be prompted, or add `--draft` to mark it not-ready.

```bash
gh pr status
```

Your PRs, their check status, and anything waiting on your review.

```bash
gh pr checks <number>
```

Whether `verify` passed on a given PR, with a link to the failing job.

```bash
gh pr view <number> --json reviewDecision,mergeStateStatus
```

Exactly _why_ a PR won't merge — missing approval, failing check, or out of date.

```bash
gh pr view <number> --web
```

Open that PR in your browser.

```bash
gh pr checkout <number>
```

Check out someone else's PR branch locally so you can actually run their code while
reviewing it. Far better than eyeballing a diff.

---

## Part 8 — This project's own commands

Not Git, but you'll type them just as often. All run from the repo root. Full list lives
in [`README.md`](../README.md).

| Command           | What it does                                                                            |
| ----------------- | --------------------------------------------------------------------------------------- |
| `pnpm install`    | Install all workspace dependencies. Run after every pull that changed `pnpm-lock.yaml`. |
| `pnpm dev`        | Run API and web together — web on `:5175`, API on `:3000`.                              |
| `pnpm lint`       | ESLint across the workspace, including the architecture boundary rules.                 |
| `pnpm typecheck`  | TypeScript, no emit, every package.                                                     |
| `pnpm test`       | Vitest in both apps.                                                                    |
| `pnpm build`      | Production build of everything.                                                         |
| `pnpm db:migrate` | Apply Prisma migrations to your local database.                                         |
| `pnpm db:seed`    | Seed the admin user. Prints a generated password **once** — save it.                    |
| `pnpm db:reset`   | Drop, recreate, re-migrate, re-seed. Local data is destroyed.                           |
| `pnpm format`     | Prettier, write mode.                                                                   |

**The one to memorise** — the same four checks CI runs, in the same order, so a pass here
means a pass there:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

---

## Cheat sheet

```bash
# ── Start a task ────────────────────────────────────────────────
git checkout dev && git pull
git checkout -b feat/<domain>-<thing>

# ── While working ───────────────────────────────────────────────
git status                      # where am I, what changed
git diff                        # what exactly changed
pnpm lint && pnpm typecheck && pnpm test && pnpm build

# ── Save and ship ───────────────────────────────────────────────
git add <files>
git commit -m "feat(<domain>): what changed"
git push -u origin feat/<domain>-<thing>
gh pr create --base dev --fill

# ── PR says "out of date" ───────────────────────────────────────
git fetch && git merge origin/dev
git push

# ── Oh no ───────────────────────────────────────────────────────
git stash                       # shelve changes to switch branches
git commit --amend --no-edit    # fix the last commit (unpushed only)
git revert <hash>               # safely undo a merged commit
git reflog                      # find anything you think you lost
```

---

## Where to go next

| Doc                                     | What's in it                                                    |
| --------------------------------------- | --------------------------------------------------------------- |
| [`ONBOARDING.md`](ONBOARDING.md)        | First-week walkthrough: install, clone, set up the DB, first PR |
| [`CONTRIBUTING.md`](../CONTRIBUTING.md) | Branch names, commit format, folder map, lint boundary rules    |
| [`CI_GUIDE.md`](CI_GUIDE.md)            | What `verify` checks, the PR gate, debugging a failed check     |
| [`PROGRESS.md`](PROGRESS.md)            | Current project status and locked decisions                     |
