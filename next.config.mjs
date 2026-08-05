/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.ts';

/** @type {import("next").NextConfig} */
const config = {
	logging: false,
	async headers() {
		const isDev = process.env.NODE_ENV === 'development';

		const csp = [
			"default-src 'self'",
			`script-src 'self' 'unsafe-inline' 'unsafe-eval'${isDev ? ' https://unpkg.com' : ''}`,
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data: blob:",
			"font-src 'self'",
			`connect-src 'self'${isDev ? ' https://unpkg.com' : ''}`,
			"frame-ancestors 'self'",
		].join('; ');

		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'Content-Security-Policy',
						value: csp,
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'Strict-Transport-Security',
						value: 'max-age=63072000; includeSubDomains; preload',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
				],
			},
		];
	},
	experimental: {
		turbopackFileSystemCacheForDev: true,
	},
};

export default config;
