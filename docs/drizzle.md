# Drizzle ORM Patterns

**Note**: These patterns reference the auth schema tables. For domain-specific tables, follow the same patterns.

## Primary Key Patterns

- Text id (used by the auth tables): `text('id').primaryKey()`
- Auto-incrementing integer: `integer('id').primaryKey().generatedByDefaultAsIdentity()`
- UUID: `uuid('id').primaryKey().defaultRandom()`

## Type Inference

```typescript
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
```

## Foreign Key References

- Cascade delete: `{ onDelete: 'cascade' }`
- Set null: `{ onDelete: 'set null' }`

```typescript
// src/server/db/schema/auth.ts
userId: text('user_id')
	.notNull()
	.references(() => user.id, { onDelete: 'cascade' }),
```

## Timestamp Defaults

```typescript
createdAt: timestamp('created_at')
	.$defaultFn(() => new Date())
	.notNull(),
updatedAt: timestamp('updated_at')
	.$defaultFn(() => new Date())
	.notNull(),
```

## Insert with Returning

```typescript
const [newUser] = await ctx.db.insert(user).values({ name, email }).returning();
```

## Update with Partial Sets

```typescript
await db.update(user).set({ ...(name && { name }), ...(email && { email }) }).where(eq(user.id, id));
```

## Reference Patterns

Not used in this codebase yet — patterns to reach for when a domain needs them.

### Soft Delete

- Schema: `deletedAt: timestamp('deleted_at')`
- Query filter: `isNull(table.deletedAt)`
- Delete: `.set({ deletedAt: new Date() })`

### Index Creation

```typescript
export const user = createTable('user', { /* fields */ }, (table) => [
	index('idx_user_name').on(table.name),
]);
```

### Many-to-Many Junction Tables

```typescript
export const teamMember = createTable('team_member', {
	teamId: text('team_id').notNull().references(() => team.id, { onDelete: 'cascade' }),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
}, (t) => [primaryKey({ columns: [t.teamId, t.userId] })]);
```
