import puppeteer from "puppeteer";
import lighthouse from "lighthouse";
import { URL } from "url";
import fs from "fs"
import path from "path";
import initOverrides from './initOverrides.js';

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

const createBrowser = (initOverrides) =>
	puppeteer.launch({
		headless: false,
		defaultViewport: null,
		args: [
			"--disable-web-security",
		]
	})
	.then(b => (b.on("targetcreated", initOverrides), b));

const loadOverrides = (basePath = '', overrideConfigs = []) => Promise.all(
	overrideConfigs.map(async config => ({
		...config,
		file: await fs.promises.readFile(path.resolve(basePath, config.localPath), 'utf8')
	}))
);

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

const saveResult = async ({ dir, name, result }) => {
	!fs.existsSync(dir) && await fs.promises.mkdir(dir);
	await fs.promises.writeFile(path.join(dir, `${name}.json`), JSON.stringify(result, null, 2));
};

export default ({
	numSamples = 2,
	url = "https://www.retailmenot.com/view/kohls.com",
	config = desktopConfig,
	logLevel = "info",
	experimentDir,
	outDir,
}) =>
async (intervention) => {
	console.log(`Running intervention: ${intervention.name}`);
	const overrideConfigs = await loadOverrides(experimentDir, intervention.overrides);
	const results = [];
	for (let i = 0; i < numSamples; i++) {
		let browser;
		try {
			browser = await createBrowser(initOverrides(overrideConfigs));
			const result = await sample({
				url,
				port: new URL(browser.wsEndpoint()).port,
				logLevel,
				config,
			});
			results.push(result);
			outDir && await saveResult({ dir: outDir, name: `intervention-${intervention.name}-${i}`, result });
		}
		catch (e) {
			console.error(e);
		}
		finally {
			await browser.close();
		}
	}
	return results;
}
