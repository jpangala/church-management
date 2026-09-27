# Windows Setup

[`ONBOARDING.md`](ONBOARDING.md) is written for Macs. **On Windows, follow this page instead of
ONBOARDING sections 2–6**, then carry on from
[ONBOARDING section 7](ONBOARDING.md#7-know-your-branch-know-your-lane).

You install the same tools as the Mac guide: Git, Node 22, pnpm and PostgreSQL 16. Only the
install commands differ. Allow about 45 minutes, most of it downloads.

> If a step here doesn't match what you see on screen, tell the lead, and we'll fix this page
> for the next person.

---

## 1. Your terminal: Git Bash

Use **Git Bash** for everything in this project. It's installed with Git in step 2. Every other
doc in this repo uses bash commands like `cp`, `rm -rf` and `&&`, and these work in Git Bash
exactly as they do on a Mac.

Avoid the built-in **Windows PowerShell** for project work. Its default version doesn't support
`&&`, so the one-line check that comes before every pull request fails there:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

You'll use PowerShell once, in step 2, and the PostgreSQL shell once, in step 5. Everything
else happens in Git Bash.

---

## 2. Install the tools

Windows 10 and 11 include **winget**, Microsoft's package installer. Open **PowerShell** from the
Start menu and run these one at a time:

```powershell
winget install --id Git.Git -e
```

```powershell
winget install --id CoreyButler.NVMforWindows -e
```

```powershell
winget install --id PostgreSQL.PostgreSQL.16 -e --interactive
```

The **`--interactive`** on PostgreSQL matters. It opens the normal installer so you can
**choose the password for the `postgres` admin account. Write it down**, because you need it in
step 5. Keep the default port, **5432**. When it offers to launch Stack Builder at the end, you
can untick that and finish.

Optional, for working with pull requests:

```powershell
winget install --id GitHub.cli -e
```

```powershell
winget install --id GitHub.GitHubDesktop -e
```

Then **close PowerShell** and open **Git Bash** from the Start menu. A freshly opened terminal
is how it picks up everything you just installed.

---

## 3. Node 22 and pnpm

In Git Bash:

```bash
nvm install 22
```

```bash
nvm use 22
```

```bash
node -v
```

That should print `v22.` followed by numbers. Name the version as shown: on Windows, `nvm use`
on its own doesn't read the project's `.nvmrc` the way the Mac version does.

Then switch on pnpm. It comes with Node:

```bash
corepack enable
```

- `nvm: command not found`: close Git Bash and open a new one.
- `corepack enable` fails with a permission error (`EPERM`): right-click **Git Bash**,
  choose **Run as administrator**, run `corepack enable` once there, then go back to a normal
  Git Bash.

---

## 4. Tell Git who you are, and get the code

Use the name and email on your GitHub account:

```bash
git config --global user.name "Your Name"
```

```bash
git config --global user.email "you@example.com"
```

Pick a folder for your code, then:

```bash
git clone https://github.com/jpangala/church-management.git
```

```bash
cd church-management
```

```bash
pnpm -v
```

That should print `9.0.0`. corepack reads the exact version from the project.

**No SSH keys needed.** Skip ONBOARDING section 3. The repo is public, so cloning needs no
sign-in. The first time you push, a browser window asks you to sign in to GitHub. That's Git
Credential Manager, which came with Git.

**Line endings are handled for you.** The repo's `.gitattributes` keeps every text file in Unix
format (LF) on every computer, so Windows and Mac edits never clash over invisible characters.

---

## 5. Create the database

From the Start menu, open **SQL Shell (psql)**. It was installed with PostgreSQL.

1. Press **Enter** four times to accept the defaults for Server, Database, Port and Username.
2. Type the **`postgres` password** you chose in step 2 and press Enter. Nothing appears while
   you type; that's normal.
3. At the `postgres=#` prompt, run these, pressing Enter after each line:

```sql
CREATE USER church WITH PASSWORD 'churchdev' CREATEDB;
CREATE DATABASE church_management OWNER church;
\q
```

Don't change these names or the password. They're what `apps/api/.env.example` expects, and this
database only ever runs on your own laptop.

---

## 6. Install and run the project

Back in **Git Bash**, inside the `church-management` folder:

```bash
pnpm install
```

**Always `pnpm`, never `npm`.** `npm install` looks like it works, but it skips every app in the
project.

```bash
cp apps/api/.env.example apps/api/.env
```

```bash
cp apps/web/.env.example apps/web/.env
```

```bash
pnpm db:migrate
```

```bash
pnpm db:seed
```

`db:seed` prints an admin password **once**. Save it, because it's how you log in. Everyone's is
different, since everyone has their own database.

```bash
pnpm dev
```

The first time, **Windows Firewall** may ask about Node.js. Allow it on **private networks**. Then
open <http://localhost:5175> and log in as `admin@church.local` with the password `db:seed` gave
you.

**You're set up.** Continue with
[ONBOARDING section 7](ONBOARDING.md#7-know-your-branch-know-your-lane).

---

## Reading the other docs on Windows

The rest of the docs were written on a Mac. Here's how to translate:

| The docs say                      | On Windows                                 |
| --------------------------------- | ------------------------------------------ |
| Terminal / iTerm                  | Git Bash                                   |
| `brew install …`                  | `winget install --id … -e` (in PowerShell) |
| `Cmd` in a shortcut               | `Ctrl`                                     |
| `Cmd+Option+I` (browser DevTools) | `F12`                                      |
| `pbcopy < file`                   | `clip < file` (works in Git Bash)          |
| `~/.zshrc`                        | not needed                                 |

---

## If something goes wrong

| You see                                               | Fix                                                                                     |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `nvm: command not found` or `pnpm: command not found` | open a new Git Bash; for pnpm, run `corepack enable` (step 3)                           |
| `Unsupported engine … wanted node >=22 <23`           | `nvm use 22`                                                                            |
| `&&` gives a syntax error                             | you're in PowerShell; use Git Bash                                                      |
| Prisma error `P1001` (can't reach the database)       | PostgreSQL isn't running: Start menu → **Services** → **postgresql-x64-16** → **Start** |
| Prisma error `P1000` (authentication failed)          | step 5 wasn't finished; open SQL Shell and run the two `CREATE` lines again             |
| `Module "@prisma/client" has no exported member …`    | `pnpm db:migrate` (or `pnpm --filter api prisma:generate`)                              |
| You ran `npm install` by mistake                      | `rm -rf node_modules package-lock.json`, then `pnpm install`                            |
| `git status` shows every file as changed              | line endings; tell the lead, since `.gitattributes` should prevent it                   |

Stuck on anything else? Copy the full error message and send it to the lead. The exact text
matters more than a description of it.
