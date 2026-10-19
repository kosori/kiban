import { defineNodeInstrumentation } from 'evlog/next/instrumentation';

export const { register, onRequestError } = defineNodeInstrumentation({
	captureOutput: true,
	service: 'kiban',
});
