//copied from https://github.com/lighthouse/lighthouse-core/config/constants.js

export const DESKTOP_EMULATION_METRICS = {
	mobile: false,
	width: 1350,
	height: 940,
	deviceScaleFactor: 1,
	disabled: false,
};

export const DESKTOP_USERAGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Safari/537.36 Chrome-Lighthouse'; // eslint-disable-line max-len

export const desktopDense4G = {
	rttMs: 40,
	throughputKbps: 10 * 1024,
	cpuSlowdownMultiplier: 1,
	requestLatencyMs: 0, // 0 means unset
	downloadThroughputKbps: 0,
	uploadThroughputKbps: 0,
};
