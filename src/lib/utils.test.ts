import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
	it('merges tailwind classes correctly', () => {
		expect(cn('px-2 py-2', 'px-4')).toBe('py-2 px-4');
	});

	it('filters out falsy values', () => {
		const shouldSkip = false;
		expect(cn('base', shouldSkip && 'skip', undefined, null, '')).toBe('base');
	});

	it('handles object syntax for conditionals', () => {
		expect(cn('base', { active: true, hidden: false })).toBe('base active');
	});

	it('handles array syntax', () => {
		const isActive = true;
		const isHidden = false;
		expect(cn(['base', isActive && 'active', isHidden && 'hidden'])).toBe(
			'base active'
		);
	});

	it('resolves tailwind conflicts', () => {
		expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
	});

	it('handles empty input', () => {
		expect(cn()).toBe('');
	});
});
