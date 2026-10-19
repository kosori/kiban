import type { Config } from 'drizzle-kit';

import { env } from '~/env';

const nonPoolingUrl = env.POSTGRES_URL.replace(':6543', ':5432');

export default {
	dbCredentials: { url: nonPoolingUrl },
	dialect: 'postgresql',
	schema: './src/server/db/schema',
	tablesFilter: ['kiban_*'],
} satisfies Config;
