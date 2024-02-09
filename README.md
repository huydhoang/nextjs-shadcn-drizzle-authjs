This template can be reproduced from scratch by following these steps:

```bash
npx create-next-app@latest nextjs-shadcn-starter

√ Would you like to use TypeScript? ... No / Yes
√ Would you like to use ESLint? ... No / Yes
√ Would you like to use Tailwind CSS? ... No / Yes
√ Would you like to use `src/` directory? ... No / Yes
√ Would you like to use App Router? (recommended) ... No / Yes
√ Would you like to customize the default import alias (@/*)? ... No / Yes

npx shadcn-ui@latest init

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

Switch to `pnpm`:

```bash
rm -rf node_modules package-lock.json
pnpm i

```

Add `prettier`:

```bash
pnpm install --save-dev prettier prettier-plugin-tailwindcss
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

Integrate `prettier` with `eslint`:

- `eslint-config-prettier` are pre-made configs that turn off rules that conflict or are unnecessary with Prettier
- `eslint-plugin-prettier` show Prettier results as part of eslint

```bash
pnpm install --save-dev eslint-config-prettier eslint-plugin-prettier
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

After this, `eslint` will display any styling errors from `prettier `for us to resolve before any commit.

Finally, we can add `prettier` to scripts inside the `package.json` file:

```json
"scripts": {
  "format": "prettier --write \"src/**/*.{ts,tsx,json,css}\""
}
```

Edit `/lib/metadata.ts` to your needs:

```ts
const siteMetadata = {
  title: 'MyApp - the marketplace for local communities',
  description:
    'MyApp is a marketplace for high-quality local goods and services.',
  creator: '@huydhoang',
  url: 'https://example.com',
}

export default siteMetadata
```

This metadata are imported in `/lib/utils.ts` and used in `src/app/layout.tsx`.

`MaxWidthWrapper.tsx` is a simple wrapper for the main content to take up full width on screen and can be reused in other components. It is imported in `src/app/page.tsx` by default.
