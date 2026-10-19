import '~/styles/globals.css';

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '~/components/theme-provider';
import { env } from '~/env';
import { cn } from '~/lib/utils';
import { TRPCReactProvider } from '~/trpc/react';

export const metadata: Metadata = {
	appleWebApp: {
		capable: true,
		startupImage: [
			{
				url: '/web-app-manifest-512x512.png',
			},
		],
		statusBarStyle: 'black-translucent',
		title: 'Kiban',
	},
	description:
		'Kiban es un template de aplicación full-stack moderno, diseñado para ofrecer una base sólida, segura y escalable. Utiliza Next.js, tRPC, Drizzle ORM y Better Auth para acelerar el desarrollo de tus proyectos.',
	metadataBase: new URL(
		env.VERCEL_ENV === 'production'
			? 'https://kiban.codingcodax.dev'
			: 'https://kiban.localhost'
	),
	openGraph: {
		description:
			'Kiban es un template de aplicación full-stack moderno, diseñado para ofrecer una base sólida, segura y escalable. Utiliza Next.js, tRPC, Drizzle ORM y Better Auth para acelerar el desarrollo de tus proyectos.',
		images: [
			{
				alt: 'Kiban - Template Moderno para Aplicaciones Full-stack',
				height: 630,
				type: 'image/png',
				url: '/og.png',
				width: 1200,
			},
		],
		siteName: 'Kiban',
		title: 'Kiban - Template Moderno para Aplicaciones Full-stack',
		url: 'https://kiban.codingcodax.dev',
	},
	title: 'Kiban - Template Moderno para Aplicaciones Full-stack',
	twitter: {
		card: 'summary_large_image',
		creator: '@codingcodax',
		site: '@codingcodax',
	},
};

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const fontMono = Geist_Mono({
	subsets: ['latin'],
	variable: '--font-mono',
});

export const viewport: Viewport = {
	maximumScale: 1,
	themeColor: [
		{ color: '#F8FAFC', media: '(prefers-color-scheme: light)' },
		{ color: '#0E172A', media: '(prefers-color-scheme: dark)' },
	],
	userScalable: false,
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
	<html
		className={cn(
			'antialiased',
			fontMono.variable,
			'font-sans',
			geist.variable
		)}
		data-scroll-behavior='smooth'
		lang='en'
		suppressHydrationWarning
	>
		<head>
			{env.NODE_ENV === 'development' && (
				<Script
					crossOrigin='anonymous'
					integrity='sha384-PXOWAzllLihCpnqFflLZrth6D6UsI8PqPYbA6qYnE44Cld6haJIBjLZR4onqH+3z'
					src='https://unpkg.com/react-grab@0.2.0/dist/index.global.js'
					strategy='beforeInteractive'
				/>
			)}
			{env.NODE_ENV === 'development' && (
				<Script
					crossOrigin='anonymous'
					integrity='sha384-XSYLwy0/dkDwkCK2b+VOV4Jo4F9JbFMvIxK+pAV414GVJbm9M1R4mLQeXr2848kJ'
					src='https://unpkg.com/@react-grab/mcp@0.1.37/dist/client.global.js'
					strategy='lazyOnload'
				/>
			)}
		</head>
		<body>
			<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
				<TRPCReactProvider>{children}</TRPCReactProvider>
			</ThemeProvider>
		</body>
	</html>
);

export default RootLayout;
