import puppeteer from "puppeteer";

import runTest from './runTest.js';
import mapAsync from "./mapAsync.js";
import loadExperiment from "./loadExperiment.js";
import summarizeExperiment from "./summarizeExperiment.js";
import printSummary from "./printSummary.js";

export default async (experimentPath = '') => {
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
	});

  const experiment = await loadExperiment(experimentPath);
	const runTreatments = mapAsync(
		runTest(browser, {
			numSamples: experiment.numSamples,
			url: experiment.url,
			logLevel: 'silent',
		}
	));

	const results = await runTreatments(experiment.treatments)
	const summary = summarizeExperiment(results);
	printSummary(experiment, summary);

	await browser.close();
}