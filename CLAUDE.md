@AGENTS.md

# ศาลเจ้ากระโสมเต้าโบ้เก้ง — Admin Panel

Back-office for the shrine's staff to manage **mediums (ม้าทรง)**, **medium helpers (พี่เลี้ยง)**, **board members (คณะกรรมการ)** and **positions (ตำแหน่ง)**. Data lives in an existing Supabase Postgres database; profile photos are stored in Google Drive.

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, `src/`, Turbopack, **Cache Components on**) |
| UI | Tailwind CSS v4 + shadcn/ui (`radix-nova` style, Radix primitives), lucide icons, sonner toasts |
| Font | Kanit (`next/font/google`, Thai + Latin) — the only font |
| DB | Prisma 7 + `@prisma/adapter-pg` → Supabase Postgres |
| Auth | Own `admin` table (username + bcrypt hash) and a signed JWT cookie (`jose`) |
| Files | Google Drive API (`googleapis`) with an **OAuth2 refresh token**, not a service account |
| Validation | zod v4 in server actions |
| Node | 22 LTS (`.nvmrc`), minimum 20.9 |

## Commands

```bash
nvm use                # Node 22
npm install            # also runs `prisma generate` (postinstall)
npm run dev            # http://localhost:3000
npm run build
npm run lint
npm run typecheck
npm run db:pull        # print the live DB schema to compare with prisma/schema.prisma (does not write)
npm run db:generate    # regenerate the client after editing prisma/schema.prisma
npm run google:token   # one-time: get GOOGLE_REFRESH_TOKEN
npm run admin:create   # add an admin / reset a password (prompts for the password)
```

## Project structure

```
src/
  app/
    layout.tsx                    Root: Kanit font, <Toaster>, lang="th"
    globals.css                   Theme tokens (the 2 brand colours live here)
    login/                        Public login page
    (dashboard)/                  Authenticated shell (Sidebar + Topbar)
      page.tsx                    ภาพรวม — stats + recent records
      mediums/ helpers/ board/ positions/   One page per entity
      error.tsx                   Thai error boundary
    api/drive-image/[id]/route.ts Auth-checked proxy streaming Drive images to <img>
  proxy.ts                        Next 16 "proxy" (was middleware): verify session cookie, redirect to /login
  components/
    ui/                           shadcn generated — avoid hand edits, regenerate with `npx shadcn add`
    layout/                       Sidebar, Topbar, MobileNav, Brand, LogoutButton
    shared/                       Reusable building blocks (see below)
  features/<entity>/              medium | helper | board | position | dashboard | auth
    types.ts                      Serializable row types passed to client components
    schema.ts                     zod schema for the form
    queries.ts                    Prisma reads (server-only)
    actions.ts                    "use server" create/update/delete
    components/                   <entity>-table (server), <entity>-form-dialog (client), <entity>-row-actions (client)
  lib/
    constants.ts                  Thai labels, option lists, nav items, Drive folder IDs
    prisma.ts                     Prisma singleton (pg adapter)
    session.ts                    Sign/verify the session JWT cookie (works in proxy and server)
    auth.ts                       getCurrentUser / requireUser
    google-drive.ts               upload / delete / move / stream files
    profile-image.ts              Form → Drive upload flow used by every person entity
    form.ts                       ActionResult type, shared zod field helpers
    list-params.ts                ?q=&page=&filter= parsing, person search, BigInt → number
    utils.ts                      cn, formatFullName, formatPhone, formatThaiDate, profileImageUrl
  generated/prisma/               Generated client (gitignored)
prisma/
  schema.prisma                   Mirrors the existing tables via @map/@@map
  sql/                            Hand-written SQL to run in Supabase SQL Editor
scripts/get-google-refresh-token.ts
scripts/create-admin.ts
public/brand/                     logo.png, temple.jpg
```

### Shared building blocks (`src/components/shared`)

- `PageHeader`: page title, description and primary action.
- `TableCard`, `TableToolbar`, `Pagination`, `TableSkeleton`, `EmptyState`: the list-page layout. Search and filters live in the URL.
- `EntityFormDialog`: the add/edit dialog wired to a server action with `useActionState`. It shows a toast and closes on success, and keeps entered values when validation fails.
- `PersonNameFields`, `FormSection`, `FormField`, `SelectField`, `TagInput`, `AvatarUpload`: form fields.
- `RowActions` + `ConfirmDeleteDialog`: the ⋯ menu on each row.
- `PersonCell`, `PersonAvatar`, `StatusBadge`, `StatCard`.

## How to add a new entity

1. **Schema:** add the model to `prisma/schema.prisma`. Map every column with `@map` and the table with `@@map`, then run `npm run db:generate`. Create the table itself with SQL in `prisma/sql/`.
2. **Feature folder:** create `src/features/<entity>/` with `types.ts`, `schema.ts`, `queries.ts`, `actions.ts` and `components/`. Copy `features/board` as a template.
3. **Page:** add `src/app/(dashboard)/<route>/page.tsx`. Keep the header static and wrap data components in `<Suspense>`.
4. **Navigation:** add an entry to `NAV_ITEMS` in `src/lib/constants.ts`.

## Rules and conventions

### UI and design

- **Thai only.** Every string a user can see must be Thai, including toasts, validation messages, `aria-label`s, `alt` text and metadata. Code, identifiers and comments may be English or Thai.
- **Two colours only.** Background `#f5f0ea` (beige) and primary `#c92a1d` (deep red), defined as `--brand-beige` and `--brand-red` in `globals.css`.
  - White cards and dark-brown text are the only neutrals.
  - Use theme tokens (`bg-primary`, `bg-accent`, `text-muted-foreground`, …). Never hard-code new hex colours.
- **Kanit everywhere.** Don't add other fonts.
- **Look and feel.** Minimal, strong, clean, following the Dribbble "Medical Admin Dashboard" layout: red sidebar, white rounded-2xl cards and tables, ⋯ row menus.

### Next.js 16 specifics

- **Proxy.** It is `src/proxy.ts`, not `middleware.ts`.
- **Cache Components is on.** Any component that reads the DB, cookies or `searchParams` must render inside `<Suspense>`.
  - Call `await connection()` at the top of data components. Prisma uses `crypto.randomUUID()`, which Next rejects during prerender otherwise.
- **`params` and `searchParams` are Promises.** Use the global `PageProps<"/route">` / `LayoutProps` / `RouteContext` helpers.
- **Read the docs.** Check `node_modules/next/dist/docs/` before using an API you're unsure about.

### Data and server actions

- **Every server action calls `requireUser()` first.** The proxy is only a first line of defence.
- **Login.** Login checks `admin.username` + `bcrypt.compare` against `admin.password_hash`, then sets the `krasom_session` httpOnly cookie (HS256 JWT, 7 days, signed with `SESSION_SECRET`).
  - Never store or log plain-text passwords. Add or reset admins only via `npm run admin:create`.
  - `public.admin` has RLS enabled with no policies, so it can't be read through the Supabase REST API.
- **Action contract.** Actions return an `ActionResult` (`{ ok, message, fieldErrors }`). Thai messages are shown as toasts.
- **Validation.** Parse with zod using the helpers in `lib/form.ts`. Empty strings become `null`.
- **Mismatched foreign keys.** `medium_helper.medium_id` and `board_direct.position_id` are `bigint`, but they point at `smallint` primary keys, so Prisma can't model the relations.
  - Keep them as `BigInt?` scalars and join manually in `queries.ts`.
  - Convert them with `toNumber()` before passing data to client components, because BigInt isn't serializable.
- **Stored option values.** `sex`, `status` and `belong_in` hold English keys (`male`/`female`, `active`/`inactive`/`retired`, `board`/`medium`/`helper`). Map them to Thai with `optionLabel()`; unknown legacy values are shown as-is.
- **`god_name` (json).** It holds a `string[]` of deity names. Read it through `parseGodName()`, which tolerates legacy shapes.
- **Never run `prisma migrate` / `prisma db push` against the live database.** The tables pre-date this app.
  - Change the schema with SQL in the Supabase SQL Editor (keep the file in `prisma/sql/`).
  - Then update `schema.prisma` and compare it with `npm run db:pull`.

### Images (Google Drive)

- **Folders.** Each entity uploads to its own Drive folder (`DRIVE_FOLDERS` in `constants.ts`):
  - male medium → `mediumMale`
  - female medium → `mediumFemale`
  - helper → `helper`
  - board → `board`
- **Upload flow.** It lives in `lib/profile-image.ts`:
  1. Upload the new file.
  2. Save `profile_path` = `webViewLink` and `profile_id` = the file ID.
  3. Delete the old file only after the DB write succeeds.
  4. If the DB write fails, roll back (delete) the new upload.
  - If a medium's sex changes, the existing file is moved to the other folder.
- **Displaying images.** Show them via `profileImageUrl(profileId)` → `/api/drive-image/[id]`. A `webViewLink` is an HTML page and can't be used as an `<img src>`.
- **Size.** The client resizes images to at most 1200px. The server accepts images up to 5MB (`serverActions.bodySizeLimit` is 6mb).

### Secrets

- **`.env` / `.env.local` are gitignored.** Only `.env.example` (placeholders) is committed.
- **Never commit passwords, DB URLs, OAuth secrets or refresh tokens.**

## Environment setup

1. **Copy the template.** Run `cp .env.example .env` (gitignored). `.env.local` also works and takes priority over `.env`.
2. **Database.** In Supabase, go to Project → Connect → ORMs (Prisma). Paste:
   - `DATABASE_URL`: the transaction pooler, port 6543, with `?pgbouncer=true`
   - `DIRECT_URL`: session/direct, port 5432
3. **Session secret.** Set `SESSION_SECRET` to a random string of 32+ characters (`openssl rand -base64 48`). Changing it logs everyone out.
4. **Run the SQL files once** in Supabase → SQL Editor:
   - `prisma/sql/001_board_direct_profile_id.sql`: adds `profile_id` to `board_direct`; without it, saving board members fails.
   - `prisma/sql/002_admin.sql`: creates the `admin` login table.
   - `prisma/sql/003_board_direct_nick_name.sql`: adds `nick_name` (ชื่อเล่น) to `board_direct`.
   - Then create the first login with `npm run admin:create`. There is no sign-up page.
5. **Google Drive** (one-time, signed in as `krasomtaobokeng@gmail.com`):
   1. In Google Cloud Console, create a project and enable the **Google Drive API**.
   2. Configure the OAuth consent screen as **External**, then **Publish app** (set it to "In production"). In "Testing" mode, refresh tokens expire after 7 days.
   3. Under Credentials, create an **OAuth client ID** of type **Web application**. Add the redirect URI `http://localhost:53682/oauth2callback`.
   4. Put `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env` and run `npm run google:token`. Open the link, approve (ignore the "unverified app" warning), and copy the printed `GOOGLE_REFRESH_TOKEN` into `.env`. The token must have the full `drive` scope; a `drive.file` token cannot see the existing folders.
