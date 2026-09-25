# Onboarding: Your First Week on This Repo

Welcome. This assumes you've never used Git or GitHub before — every step is spelled out.
If you already know Git, skim the bold headers and jump to whatever's new to you.

You should have already received a GitHub invite email for **jpangala/church-management**.
If not, ask the repo lead to send it before continuing.

**Two ways to do the Git parts of this guide.** The default below uses the terminal,
because that's what the rest of the team uses day to day and it's worth learning. But
every Git/GitHub step (auth, clone, commit, push, PR) also has a GUI alternative using
**GitHub Desktop**, a free app — look for the 🖱️ **GUI alternative** box under each step.
Installing the project itself (Node, pnpm, Postgres, running the app) always needs the
terminal either way — there's no GUI for that part.

---

## 0. A few words you'll see everywhere

Skip this if you've used Git before.

> These are the nine words you need to get started. For the full glossary, every
> command with worked examples, how to read Git's error messages, and how to undo
> things safely, see [`GIT_REFERENCE.md`](GIT_REFERENCE.md) — it's a lookup file,
> not something to read end to end.

| Word                  | Meaning                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Repo** (repository) | The project's folder, plus its full history of changes. Lives on GitHub _and_ as a copy on your laptop.        |
| **Clone**             | Downloading a copy of the repo to your laptop for the first time.                                              |
| **Commit**            | A saved snapshot of changes, with a message describing what changed.                                           |
| **Branch**            | An independent line of work, so you can make changes without touching everyone else's code until you're ready. |
| **Push**              | Uploading your local commits to GitHub.                                                                        |
| **Pull**              | Downloading commits other people pushed.                                                                       |
| **Pull Request (PR)** | A request to merge your branch into another branch, with a review/CI gate in between.                          |
| **CI**                | Automated checks (lint, types, tests, build) that run on every PR.                                             |
| **Merge**             | Combining one branch's changes into another.                                                                   |

---

## 1. Accept the GitHub invite

1. Open the invite email (or go to <https://github.com/jpangala/church-management/invitations>) and click **Accept invitation**.
2. You now have **Write** access — you can push branches and open PRs, but `main` and `dev` are protected (more on that in step 8).
3. If you don't already have a GitHub account, create one first at <https://github.com/signup>, _then_ accept the invite.

---

## 2. Install the tools

Install these in order. All commands go in your terminal (macOS: Terminal or iTerm).

### 2.1 Git

Check if you already have it:

```bash
git --version
```

If that fails, install it (macOS, via Homebrew — install Homebrew first from <https://brew.sh> if you don't have it):

```bash
brew install git
```

### 2.2 Tell Git who you are

This name/email gets attached to every commit you make — use your real name and the email tied to your GitHub account.

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

### 2.3 Node.js via nvm

This repo pins an exact Node version (see `.nvmrc` in the repo root — currently **Node 22**). Use `nvm` so you can match it exactly instead of whatever Node you happen to have:

```bash
brew install nvm
mkdir -p ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc
source ~/.zshrc
nvm install 22
nvm use 22
```

### 2.4 pnpm

This repo uses pnpm, not npm or yarn, as its package manager. Enable it via Node's built-in corepack:

```bash
corepack enable
```

You don't need to `brew install pnpm` separately — corepack reads the `packageManager` field in the repo's `package.json` and gets you the exact right version automatically once you're inside the repo folder.

### 2.5 PostgreSQL 16

The app needs a local database to run against.

```bash
brew install postgresql@16
brew services start postgresql@16
pg_isready
```

`pg_isready` should print `accepting connections`. If it doesn't, Postgres isn't running — re-run `brew services start postgresql@16` and check `brew services list` for errors.

### 2.6 GitHub CLI (recommended, not required)

Makes opening/checking PRs from the terminal much easier instead of doing it all in the browser.

```bash
brew install gh
gh auth login
```

Follow the prompts — pick **GitHub.com**, **HTTPS**, and authenticate via the browser when asked.

### 2.7 GitHub Desktop (optional, GUI alternative)

> 🖱️ **GUI alternative.** If you'd rather not touch a terminal for Git itself, install
> [GitHub Desktop](https://desktop.github.com). Open it, sign in with your GitHub
> account when prompted (**File → Options/Preferences → Accounts → Sign in**), and it
> handles authentication for you — you can skip Section 3 (SSH) entirely and use HTTPS
> everywhere GitHub Desktop offers to clone or push. You'll still need the terminal for
> Section 5 onward (installing dependencies, the database, running the app, and the
> `pnpm lint/typecheck/test/build` checks) — GitHub Desktop only handles the Git side.

---

## 3. Connect Git to GitHub (SSH)

Skip this whole section if you installed GitHub Desktop in 2.7 and signed in there —
it manages authentication for you. This section is for the terminal path.

You need a way to prove to GitHub that pushes are really from you. SSH keys are the standard approach — set this up once, forever.

```bash
# Generate a key (press Enter through the prompts to accept defaults, but DO set a passphrase)
ssh-keygen -t ed25519 -C "you@example.com"

# Start the ssh-agent and add your new key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy your public key to the clipboard
pbcopy < ~/.ssh/id_ed25519.pub
```

Then:

1. Go to <https://github.com/settings/keys> → **New SSH key**.
2. Paste it in, give it a title like "MacBook — work", save.
3. Test the connection:
   ```bash
   ssh -T git@github.com
   ```
   You should see `Hi <your-username>! You've successfully authenticated...`

---

## 4. Clone the repo

Pick a folder where you keep code, then:

```bash
git clone git@github.com:jpangala/church-management.git
cd church-management
```

> 🖱️ **GUI alternative.** In GitHub Desktop: **File → Clone Repository**, switch to the
> **URL** tab, paste `https://github.com/jpangala/church-management.git`, pick a local
> folder, click **Clone**. Note the folder it clones into — you'll need to `cd` there in
> a terminal for every step from Section 5 onward.

---

## 5. Install dependencies and set up the database

Run these **from the repo root**, in order:

```bash
# 1. Match the pinned Node version
nvm use

# 2. Install all workspace dependencies
pnpm install

# 3. Create the local Postgres role and database (first time only)
psql postgres -c "CREATE USER church WITH PASSWORD 'churchdev' CREATEDB;"
psql postgres -c "CREATE DATABASE church_management OWNER church;"

# 4. Copy the environment templates
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 5. Apply database migrations
pnpm db:migrate

# 6. Seed an admin user — this prints a generated password ONCE, save it somewhere
pnpm db:seed
```

If step 3 errors saying the role/database already exists, that's fine — someone (or a past you) already ran it; skip past it.

---

## 6. Run the app

```bash
pnpm dev
```

This starts both the API and the web frontend together:

- **Web:** <http://localhost:5175>
- **API:** <http://localhost:3000>

Open the web URL in your browser. If it loads and you can log in with the admin credentials `pnpm db:seed` printed, your environment is working. Leave this running in its own terminal tab while you work — `Ctrl+C` to stop it.

---

## 7. Know your branch, know your lane

Before writing any code, read [`CONTRIBUTING.md`](../CONTRIBUTING.md) — it covers branch naming, commit style, and where files go. The short version:

```
main   ← deployable, protected. Never push here directly.
 ↑
dev    ← everyone's work lands here first. Never push here directly either.
 ↑
feat/<domain>-<thing>   ← your branch, made fresh for each task.
```

**Ask the repo lead which domain you own** (Identity & Access, Members & Projects, Bookings & Assets, or Finance) — that's checked in [`.github/CODEOWNERS`](../.github/CODEOWNERS) and it decides which folders you're the primary reviewer/owner of, and roughly which folders your work will live in day to day.

---

> **Before your first real task, do the [practice drill](PRACTICE_DRILL.md).** It's a throwaway
> feature that walks you through this whole loop, using every UI component, and has you break
> CI on purpose so you know what a failure looks like.

## 8. Your first change, end to end

This walks through one full cycle — do this for every task from now on.

```bash
# 1. Make sure you're starting from the latest dev
git checkout dev
git pull

# 2. Create your branch (swap in your actual domain and task)
git checkout -b feat/<domain>-<short-description>
```

> 🖱️ **GUI alternative (steps 1–2).** In GitHub Desktop: top bar → **Current branch**
> dropdown → select `dev` → **Fetch origin** (or `Ctrl/Cmd+Shift+P`) to pull the latest.
> Then **Current branch → New branch**, name it `feat/<domain>-<short-description>`,
> base it on `dev`, click **Create branch**. GitHub Desktop switches you onto it
> automatically.

```bash
# 3. Make your change in your editor, then check what changed
git status
git diff
```

> 🖱️ In GitHub Desktop, the **Changes** tab on the left shows every modified file, with
> a diff on the right as you click through them — no command needed.

```bash
# 4. Run the same checks CI will run — fix anything red before continuing
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

This step always needs the terminal — GitHub Desktop doesn't run lint/typecheck/test/build.
`cd` into the repo folder and run it there even if you did steps 1–3 in the GUI.

```bash
# 5. Stage and commit — message format matters, see CONTRIBUTING.md
git add <the files you changed>
git commit -m "feat(<domain>): short description of what changed"

# 6. Push your branch to GitHub
git push -u origin feat/<domain>-<short-description>
```

> 🖱️ **GUI alternative (steps 5–6).** In GitHub Desktop's **Changes** tab, check the
> files you want to include (all are checked by default), type a summary in the message
> box at the bottom-left (this is your commit message — follow the same
> `feat(<domain>): ...` format), click **Commit to feat/...**, then click **Push origin**
> in the top bar.

7. Open a PR:
   - Terminal: `gh pr create --base dev --title "feat(<domain>): short description" --fill`
   - Browser: go to the repo, GitHub shows a yellow banner for your just-pushed branch with a **Compare & pull request** button.
   - 🖱️ GitHub Desktop: top bar → **Preview Pull Request**, review the diff, click
     **Create Pull Request** — this opens the PR form in your browser to finish (fill in
     the template) and submit.
   - **Target `dev`**, not `main`, whichever way you open it — double-check the base
     branch dropdown before submitting; it sometimes defaults to `main`.
8. Fill in the PR template honestly — especially **"How I tested it."** "CI is green" doesn't count as an answer there; say what you actually ran or clicked through.
9. Wait for the `verify` check to go green (see [`docs/CI_GUIDE.md`](CI_GUIDE.md) if it fails — it tells you exactly how to debug each step).
10. Once CI passes (and once required, once a reviewer approves), **squash-merge** the PR — GitHub's merge button on the PR page has a dropdown, pick "Squash and merge."
11. Delete your branch (GitHub offers a button for this right after merging) and start your next task from step 1.

`dev` gets promoted into `main` separately at the end of each sprint by the repo lead — that's not something you do yourself.

---

## 9. If something goes wrong

- **CI fails on your PR** → [`docs/CI_GUIDE.md`](CI_GUIDE.md) has a section for exactly this: which step failed, how to reproduce it locally, and fixes for the most common cases (stale lockfile, import-boundary lint errors, flaky tests).
- **`git push` says "Permission denied (publickey)"** → your SSH key from step 3 isn't registered or the agent isn't running; re-run `ssh -T git@github.com` to check.
- **`pnpm install` fails with a lockfile error** → don't run it with `--frozen-lockfile` locally; plain `pnpm install` will update the lockfile — then commit it.
- **You're not sure if your branch is behind `dev`** → `git fetch && git log HEAD..origin/dev --oneline` shows what you're missing. If you're behind, `git merge origin/dev` (or ask the lead — merge conflicts on a first PR are normal, not a sign you did something wrong).
- **Genuinely stuck** → ask before forcing anything. Don't run `git push --force`, `git reset --hard`, or delete branches you're not sure about — ask the repo lead first.

---

## 10. Reference

| Doc                                           | What's in it                                                                                       |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [`README.md`](../README.md)                   | Stack overview, full script list                                                                   |
| [`CONTRIBUTING.md`](../CONTRIBUTING.md)       | Branch/commit conventions, folder map, lint rules, test conventions                                |
| [`docs/GIT_REFERENCE.md`](GIT_REFERENCE.md)   | Every Git/GitHub word and command explained, with examples and a cheat sheet                       |
| [`docs/UI_KIT.md`](UI_KIT.md)                 | The 22 shared UI components: props, examples, gotchas, responsive rules                            |
| [`docs/PRACTICE_DRILL.md`](PRACTICE_DRILL.md) | A 2–3 hour practice feature: uses every UI component, and walks you through breaking and fixing CI |
| [`docs/CI_GUIDE.md`](CI_GUIDE.md)             | What CI checks, the PR approval gate, debugging a failed check                                     |
| [`docs/PROGRESS.md`](PROGRESS.md)             | Current project status                                                                             |
