# Portal Authentication MVP

Multi-tenant portal login for the site-base starter using **Auth.js (NextAuth v5)**, **Prisma**, and **SQLite**.

## Quick start

1. Copy env vars from `.env.remote.example` into `.env.local` (do not commit `.env.local`).
2. Install dependencies and prepare the database:

```bash
npm install
npm run db:push
npm run db:seed
```

3. Start the app:

```bash
npm run dev
```

4. Add the **Authentication** rendering to a Sitecore page (Experience Editor) and pick the shared **Portal Login** datasource.

## Seed users

| Customer   | Email                  | Password     |
|-----------|------------------------|--------------|
| chipotle  | chipotle@example.com   | password123  |
| tacobell  | tacobell@example.com   | password123  |

Each user belongs to exactly one customer. Login validates **email + password only**; `customerSlug` is resolved from the user record in the database and stored on the JWT session.

## Environment variables

See `.env.remote.example` — Authentication section:

- `AUTH_SECRET` — required (`openssl rand -base64 32`)
- `AUTH_URL` — public app URL (recommended in production)
- `DATABASE_URL` — SQLite path, e.g. `file:./prisma/dev.db`
- `AUTH_EXPOSE_RESET_LINK` — set `true` in dev to return reset URLs from the API (instead of email)

Legacy demo credentials (`AUTH_DEMO_USERNAME` / `AUTH_DEMO_PASSWORD`) still work for the existing **AuthPanel** component.

## Password reset (MVP)

1. **From login component** — “Forgot password?” calls `POST /api/auth/password-reset/request` with email only.
2. **Dedicated page** — `/[site]/[locale]/reset-password` (token appended when link is generated).
3. **Dev mode** — reset URL is returned in the API response and logged to the server console.

### Wiring real email later

In `src/app/api/auth/password-reset/request/route.ts`, replace the dev `resetUrl` response with your email provider (SendGrid, SES, etc.) using the generated token. Keep token storage in `PasswordResetToken` unchanged.

## Sitecore component

**Authentication** datasource fields (UI/branding only — not tenant-scoped):

- `title`, `subtitle`, `logo` — branding and copy
- `postLoginRedirect` — General Link to a Sitecore page (internal path used after login)
- Label fields (`loginButtonText`, `userNameLabel`, etc.)
- `resetPasswordPath` — relative path for forgot-password flow (default `/reset-password`)

Use a **single shared datasource** (e.g. **Portal Login** at `/sitecore/content/dfs/dfs/Data/Authentication/Portal Login`) on all portal login pages. Do not create per-customer login datasources.

Rendering parameters (optional): `redirectUrl`, `postLogoutRedirect` — same as AuthPanel.

Query string overrides: `callbackUrl` / `redirect` after login; `post_logout_redirect` after logout.

## API routes

| Route | Purpose |
|-------|---------|
| `/api/auth/[...nextauth]` | Auth.js session (login/logout) |
| `/api/auth/password-reset/request` | Request reset token (email only) |
| `/api/auth/password-reset/confirm` | Set new password with token |

## Session shape

JWT session includes `user.customerSlug` for tenant-scoped portal features. Customer is determined at login from the User record, not from the Sitecore datasource.

## Database

User `email` is **globally unique** across all customers. One email maps to one portal account and one customer tenant.

After upgrading from per-customer login, run:

```bash
npm run db:push
npm run db:seed
```

If you had duplicate emails across customers in an older schema, resolve conflicts before applying the unique constraint.

## Portal Hub (dfs)

Author checklist for the shared manager portal hub on the **dfs** site:

- **Page:** `/sitecore/content/dfs/dfs/Home/Portal`
- **Component:** PortalHub, datasource **Manager Portal Hub**
- **Rendering params:** `industryType=restaurant`, `hubItemPath=/sitecore/content/dfs/dfs/Data/Portal Hub`
- **One hub for all customers** — do not create per-chain or per-customer hub items
- **Publish:** Portal Hub templates + `Data/Portal Hub` + `Data/Portal Hubs`
- **Optional env:** `PORTAL_HUB_ITEM_PATH`, `NEXT_PUBLIC_DEFAULT_SITE_NAME=dfs`
