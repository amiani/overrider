declare module '@sitespeed.io/throttle' {
	interface Options {
		localhost?: string;
		rtt?: number;
		up?: number;
		down?: number;
	}

	const start: (options?: Options) => Promise<void>;
	const stop: (options?: Options) => Promise<void>;
	export default {
		start,
		stop
	}
}
