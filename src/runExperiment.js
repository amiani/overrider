import puppeteer from "puppeteer";

import runTest from './runTest.js';
import mapAsync from "./mapAsync.js";
import loadExperiment from "./loadExperiment.js";
import printLCP from "./printLCP.js";

export default async (experimentPath = '') => {
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
	});

  const experiment = await loadExperiment(experimentPath);
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
}