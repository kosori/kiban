# tRPC Patterns

## Client

Kiban uses the classic `createTRPCReact` client from `~/trpc/react`. It is still supported, but tRPC now recommends `@trpc/tanstack-react-query` for new projects; this template intentionally keeps the classic client.

## Protected Procedure

**When**: Requires authentication. Validates session, throws UNAUTHORIZED if not.

```typescript
// src/server/api/trpc.ts
export const protectedProcedure = t.procedure
	.use(timingMiddleware)
	.use(({ ctx, next }) => {
		if (!ctx.session) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
		return next({
			ctx: {
				// infers the `session` as non-nullable
				session: { ...ctx.session },
				user: { ...ctx.user },
			},
		});
	});
```

## Public Procedure

**When**: No authentication required.

```typescript
// src/server/api/routers/auth/get-session.ts
export const getSession = publicProcedure.query(({ ctx }) => ({
	session: ctx.session,
	user: ctx.user,
}));
```

## Query Procedure

**When**: Fetching data. Procedures are grouped into routers under `src/server/api/routers/` and registered on the app router in `src/server/api/root.ts`:

```typescript
// src/server/api/routers/auth/auth.ts
export const authRouter = {
	getSession,
} satisfies TRPCRouterRecord;
```

Call from the client with the inferred `api` export from `~/trpc/react`:

```typescript
const { session, user } = await api.auth.getSession.query();
```

## Mutation Procedure

**When**: Creating, updating, or deleting data. No mutations exist yet — use this pattern when adding a domain router:

```typescript
export const create = protectedProcedure
	.input(z.object({ name: z.string().min(1) }))
	.mutation(async ({ input, ctx }) => {
		const [newUser] = await ctx.db.insert(user).values(input).returning();
		return newUser;
	});
```

## Input Validation with Zod

Zod schemas drive both env validation and procedure inputs. Server-side env validation in `src/env.ts`:

```typescript
export const env = createEnv({
	server: {
		POSTGRES_URL: z.url(),
		BETTER_AUTH_SECRET: z.string().min(1),
	},
	// ...
});
```

## Query Schema with Pagination

Reference pattern — a reusable pagination schema. Not yet implemented in this codebase:

```typescript
export const ListQuery = z.object({
	search: z.string().optional(),
	page: z.number().int().min(1).default(1),
	perPage: z.number().int().min(1).max(100).default(10),
	sort: z
		.array(z.object({ id: z.string(), desc: z.boolean() }))
		.default([{ id: 'name', desc: false }]),
});
```

## Error Handling

**When**: Handling errors. Common codes: BAD_REQUEST, NOT_FOUND, FORBIDDEN, UNAUTHORIZED.

```typescript
throw new TRPCError({ code: 'NOT_FOUND', message: `Entity ${id} not found` });
```

## Database Transactions

**When**: Multiple operations that must succeed/fail together.

Reference pattern — no transaction usage exists yet in this codebase:

```typescript
await ctx.db.transaction(async (tx) => {
	await tx.update(user).set({ name: newName }).where(eq(user.id, userId));
	await tx.insert(account).values({ accountId, providerId, userId });
});
```
