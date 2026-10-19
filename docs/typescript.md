# TypeScript Conventions

This project uses TypeScript 7 with the native compiler. `bun typecheck` runs `tsc --noEmit`.

## type vs interface

- Use `type` for most things
- Use `interface` only when extension is needed

```typescript
export type AppRouter = typeof appRouter; // from '~/server/api/root'
export type RouterInputs = inferRouterInputs<AppRouter>; // from '~/trpc/react'
```

## Import Patterns

```typescript
import type { RouterOutputs } from '~/trpc/react'; // Type-only imports
import { z } from 'zod';                             // Value imports
import { protectedProcedure } from '~/server/api/trpc';
```

## Zod Schema with JSDoc

```typescript
// Server-side env validation (src/env.ts)
export const env = createEnv({
	server: {
		POSTGRES_URL: z.url(),
		BETTER_AUTH_SECRET: z.string().min(1),
	},
	// ...
});
```

## Generic Utility Types

```typescript
export type ArrayElement<T extends unknown[] | null> = T extends (infer U)[] ? U : never;
export type SortOption<T extends string = string> = { id: T; desc: boolean };
```

## Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Types/Interfaces | PascalCase | `AppRouter`, `RouterOutputs` |
| Variables/Functions | camelCase | `getBaseUrl`, `createQueryClient` |
| Schema constants | camelCase | `user`, `account`, `env` |
| Enum values | SCREAMING_SNAKE_CASE | `NODE_ENV` |
| Generic type params | T, TData, TKey | `<TData>` |
