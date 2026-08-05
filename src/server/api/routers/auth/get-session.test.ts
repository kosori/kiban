import { describe, expect, it, vi } from 'vitest';
import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { getSession } from './get-session';

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

const createTestCaller = createCallerFactory(createTRPCRouter({ getSession }));

describe('getSession procedure', () => {
	it('returns session and user from context', async () => {
		const mockCtx = {
			db: {},
			session: { id: 's1', userId: 'u1', expiresAt: new Date() },
			user: { id: 'u1', name: 'Test', email: 'test@example.com' },
			headers: new Headers(),
		};

		const caller = createTestCaller(() => mockCtx as never);
		const result = await caller.getSession();

		expect(result.session).toEqual(mockCtx.session);
		expect(result.user).toEqual(mockCtx.user);
	});

	it('returns undefined session and user when not authenticated', async () => {
		const mockCtx = {
			db: {},
			session: undefined,
			user: undefined,
			headers: new Headers(),
		};

		const caller = createTestCaller(() => mockCtx as never);
		const result = await caller.getSession();

		expect(result.session).toBeUndefined();
		expect(result.user).toBeUndefined();
	});

	it('returns only session and user keys', async () => {
		const mockCtx = {
			db: {},
			session: undefined,
			user: undefined,
			headers: new Headers(),
		};

		const caller = createTestCaller(() => mockCtx as never);
		const result = await caller.getSession();

		expect(Object.keys(result)).toEqual(['session', 'user']);
	});
});
