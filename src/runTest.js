import lighthouse from "lighthouse";
import { URL } from "url";

import { DESKTOP_EMULATION_METRICS, DESKTOP_USERAGENT, desktopDense4G } from "./constants.js";

/*
const createPasses = (numPasses = 0) => {
	const passes = [];
	for (let i = 0; i < numPasses; i++) {
		passes.push({ passName: `pass-${i}` });
	};
	return passes;
};
*/

const desktopConfig = {
	extends: "lighthouse:default",
	settings: {
		onlyAudits: [
			"largest-contentful-paint",
			"cumulative-layout-shift",
			"total-blocking-time",
		],
		formFactor: "desktop",
		screenEmulation: DESKTOP_EMULATION_METRICS,
		emulatedUserAgent: DESKTOP_USERAGENT,
		throttling: desktopDense4G,
	},
	//passes: createPasses(2),
};

export default (
	browser,
	{
		numSamples = 1,
		url = "https://www.retailmenot.com/view/kohls.com",
		config = desktopConfig,
		logLevel = "info",
	}
) =>
async (treatment) => {
	console.log(`Running treatment: ${treatment.name}`);
	browser.removeAllListeners();
	browser.on("targetcreated", treatment.override);

	const results = [];
	for (let i = 0; i < numSamples; i++) {
		const result = await lighthouse(
			url,
			{
				port: new URL(browser.wsEndpoint()).port,
				output: "json",
				logLevel,
			},
			config
		);
		results.push(result);
	}
	return results;
}
