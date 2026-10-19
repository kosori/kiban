import { describe, expect, it, vi } from 'vitest';
import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { getSession } from './get-session';

vi.mock('~/env', () => ({
	env: {
		APP_URL: undefined,
		BETTER_AUTH_SECRET: 'test-secret',
		GOOGLE_CLIENT_ID: 'test-id',
		GOOGLE_CLIENT_SECRET: 'test-secret',
		NODE_ENV: 'test',
		POSTGRES_URL: 'postgresql://user:pass@localhost:5432/test',
	},
}));

const createTestCaller = createCallerFactory(createTRPCRouter({ getSession }));

describe('getSession procedure', () => {
	it('returns session and user from context', async () => {
		const mockCtx = {
			db: {},
			headers: new Headers(),
			session: { expiresAt: new Date(), id: 's1', userId: 'u1' },
			user: { email: 'test@example.com', id: 'u1', name: 'Test' },
		};

		const caller = createTestCaller(() => mockCtx as never);
		const result = await caller.getSession();

		expect(result.session).toEqual(mockCtx.session);
		expect(result.user).toEqual(mockCtx.user);
	});

	it('returns undefined session and user when not authenticated', async () => {
		const mockCtx = {
			db: {},
			headers: new Headers(),
			session: undefined,
			user: undefined,
		};

		const caller = createTestCaller(() => mockCtx as never);
		const result = await caller.getSession();

		expect(result.session).toBeUndefined();
		expect(result.user).toBeUndefined();
	});

	it('returns only session and user keys', async () => {
		const mockCtx = {
			db: {},
			headers: new Headers(),
			session: undefined,
			user: undefined,
		};

		const caller = createTestCaller(() => mockCtx as never);
		const result = await caller.getSession();

		expect(Object.keys(result)).toEqual(['session', 'user']);
	});
});
