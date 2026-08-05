import { TRPCError } from '@trpc/server';
import { describe, expect, it, vi } from 'vitest';
import { createTRPCRouter, protectedProcedure } from './trpc';

vi.mock('~/env', () => ({
	env: {
		NODE_ENV: 'test',
		POSTGRES_URL: 'postgresql://user:pass@localhost:5432/test',
		BETTER_AUTH_SECRET: 'test-secret',
		GOOGLE_CLIENT_ID: 'test-id',
		GOOGLE_CLIENT_SECRET: 'test-secret',
		APP_URL: undefined,
	},
}));

describe('protectedProcedure', () => {
	const testRouter = createTRPCRouter({
		protected: protectedProcedure.query(() => 'ok'),
	});

	it('throws UNAUTHORIZED when session is undefined', async () => {
		const ctx = { session: undefined, user: undefined };
		const caller = testRouter.createCaller(ctx as never);

		const promise = caller.protected();
		await expect(promise).rejects.toThrow(TRPCError);
		await expect(promise).rejects.toHaveProperty('code', 'UNAUTHORIZED');
	});

	it('allows access when session exists', async () => {
		const ctx = {
			session: { id: 's1', userId: 'u1', expiresAt: new Date() },
			user: { id: 'u1', name: 'Test' },
		};
		const caller = testRouter.createCaller(ctx as never);

		const result = await caller.protected();

		expect(result).toBe('ok');
	});

	it('throws UNAUTHORIZED when session is null', async () => {
		const ctx = { session: null, user: null };
		const caller = testRouter.createCaller(ctx as never);

		await expect(caller.protected()).rejects.toThrow(TRPCError);
	});
});

describe('createTRPCRouter', () => {
	it('creates a router with defined procedures', () => {
		const router = createTRPCRouter({
			hello: protectedProcedure.query(() => 'world'),
		});

		expect(router.hello).toBeDefined();
		expect(typeof router.hello).toBe('function');
	});
});
