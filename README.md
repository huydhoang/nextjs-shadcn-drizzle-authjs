This template can be reproduced from scratch by following these steps:

## Enable `pnpm` with `corepack`:

Make sure `Node.js` v16.9 or later was installed. Then you can simply enable `corepack` with:

```bash
corepack enable
```

Verify that `pnpm` is available:

```bash
pnpm -v
```

Other than that, you can install `pnpm` globally with:

```bash
npm install -g pnpm
```

## Create Next.js app:

Select `Yes` for the `src` directory and `App Router`:

```bash
pnpx create-next-app@latest nextjs-shadcn-drizzle-authjs

√ Would you like to use TypeScript? ... No / Yes
√ Would you like to use ESLint? ... No / Yes
√ Would you like to use Tailwind CSS? ... No / Yes
√ Would you like to use `src/` directory? ... No / Yes
√ Would you like to use App Router? (recommended) ... No / Yes
√ Would you like to customize the default import alias (@/*)? ... No / Yes

pnpx shadcn-ui@latest init

√ Would you like to use TypeScript (recommended)? no / yes
√ Which style would you like to use? › Default
√ Which color would you like to use as base color? › Neutral
√ Where is your global CSS file? › › src/app/globals.css
√ Do you want to use CSS variables for colors? › no / yes
√ Are you using a custom tailwind prefix eg. tw-? (Leave blank if not) ...
√ Where is your tailwind.config.js located? › tailwind.config.ts
√ Configure the import alias for components: › @/components
√ Configure the import alias for utils: › @/lib/utils
√ Are you using React Server Components? › no / yes

```

`shadcn-ui` will install some deps and create `/lib/utils.ts` and `/components` folder.

## Add `prettier`:

```bash
pnpm add --save-dev prettier prettier-plugin-tailwindcss
```

`.prettierrc.json`

```json
{
  "semi": false,
  "singleQuote": true,
  "jsxSingleQuote": true, // this makes sure all jsx classnames use single quotes to be consistent with the `cn()` function from shadcn-ui
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

## Integrate `prettier` with `eslint`:

- `eslint-config-prettier` are pre-made configs that turn off rules that conflict or are unnecessary with Prettier
- `eslint-plugin-prettier` show Prettier results as part of eslint

```bash
pnpm add --save-dev eslint-config-prettier eslint-plugin-prettier
```

`.eslintrc.json`:

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": ["error"]
  }
}
```

After this, `eslint` will display any styling errors from `prettier ` alongside TypeScript errors.

Finally, we can add `prettier` to `scripts` inside the `package.json` file:

```json
"scripts": {
  "format": "prettier --write \"src/**/*.{ts,tsx,json,css}\""
}
```

## Add `drizzle-orm` for database:

authjs drizzle adapter + turso

```bash
pnpm add drizzle-orm @auth/drizzle-adapter @libsql/client
pnpm add drizzle-kit --save-dev
```

Sqlite schema `src/lib/db/schema.ts`

```ts
import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core'
import type { AdapterAccount } from '@auth/core/adapters'

export const users = sqliteTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
})

export const accounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
)

export const sessions = sqliteTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
})

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
)
```

Make sure `turso cli` is installed (only available on macOS, Linux or WSL).
Then a turso db auth token can be created with:

```bash
turso db show <database-name>
turso db tokens create <database-name> --expiration none
```

Add `next-auth`

```bash
pnpm add next-auth@beta @auth/core
```

`src/app/api/auth/[...nextauth]/route.ts`

```ts
import { handlers } from '@/auth'

export const { GET, POST } = handlers
```

## Add a button with shadcn-ui

```bash
pnpm dlx shadcn-ui@latest add button
```

Then conveniently use its buttonVariants to style links on the home page.

## Warning:

Currently `middleware` throws an error when logging in again using the same email address, probably because cookie was not properly cleaned after signing out. A known workaround is adding `allowDangerousEmailAccountLinking: true` to GoogleProvider inside `auth.ts`. While not ideal, it works. Keep watching for updates from the `next-auth` docs.
