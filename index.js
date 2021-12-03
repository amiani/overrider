import puppeteer from "puppeteer";

import runTest from './src/runTest.js';
import override from "./src/override.js";
import summarize from "./src/summarize.js";
import mapAsync from "./src/mapAsync.js";

const url = "https://www.retailmenot.com/view/kohls.com";
const remotePath = 'https://www.retailmenot.com/view/kohls.com';
const liveLocalPath = './experiments/kohls.com.live';
const modifiedLocalPath = './experiments/kohls.com.nopre';
const overrideKohlsLive = override(remotePath)(liveLocalPath);
const overrideKohlsModified = override(remotePath)(modifiedLocalPath);
const treatments = [overrideKohlsLive, overrideKohlsModified];

const getLCP = (result) => result.lhr.audits['largest-contentful-paint'].numericValue / 1000;

(async () => {
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
	});

	const runTreatment = runTest(browser, {
		numSamples: 20,
		url,
	});

	const results = await mapAsync(runTreatment)(treatments)
	results
		.map((result) => result.map(getLCP))
		.map(summarize)
		.forEach((result) => console.log(result.toString()));

	await browser.close();
})();