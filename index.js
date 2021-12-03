import puppeteer from "puppeteer";

import runTest from './src/runTest.js';
import mapAsync from "./src/mapAsync.js";
import loadExperiment from "./src/loadExperiment.js";
import printLCP from "./src/printLCP.js";

(async () => {
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
	});

  const experiment = await loadExperiment('./experiments/nopres/config.json');
	const runTreatment = mapAsync(
		runTest(browser, {
			numSamples: experiment.numSamples,
			url: experiment.url,
			logLevel: 'silent',
		}
	));

	const baselineResult = await runTreatment([experiment.baseline]);
	printLCP(baselineResult);
	const treatmentResults = await runTreatment(experiment.treatments)
	printLCP(treatmentResults);

	await browser.close();
})();