import puppeteer from "puppeteer";
import lighthouse from "lighthouse";
import { URL } from "url";
import fs from "fs"
import path from "path";

import { DESKTOP_EMULATION_METRICS, DESKTOP_USERAGENT, desktopDense4G, NO_THROTTLING } from "./constants.js";

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
		throttlingMethod: 'provided',
		throttling: NO_THROTTLING,
		maxWaitForLoad: 10000,
	},
};

const createBrowser = async (override) =>
	puppeteer.launch({
		headless: true,
		defaultViewport: null,
	})
	.then(b => (b.on("targetcreated", override), b));

const sample = ({ url, port, logLevel, config, }) =>
	lighthouse(
		url,
		{
			port,
			output: "json",
			logLevel,
		},
		config
	);

const saveResults = (dir) => async ({ name, result }) => {
	!fs.existsSync(dir) && await fs.promises.mkdir(dir);
	await fs.promises.writeFile(path.join(dir, `${name}.json`), JSON.stringify(result, null, 2));
};

export default ({
	numSamples = 2,
	url = "https://www.retailmenot.com/view/kohls.com",
	config = desktopConfig,
	logLevel = "info",
	outDir,
}) =>
async (intervention) => {
	console.log(`Running intervention: ${intervention.name}`);
	const results = [];
	for (let i = 0; i < numSamples; i++) {
		let browser;
		try {
			browser = await createBrowser(intervention.override);
			const result = await sample({
				url,
				port: new URL(browser.wsEndpoint()).port,
				logLevel,
				config,
			});
			results.push(result);
			outDir && await saveResults(outDir)({ name: `intervention-${intervention.name}-${i}`, result });
		}
		finally {
			await browser.close();
		}
	}
	return results;
}
