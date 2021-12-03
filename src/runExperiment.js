import puppeteer from "puppeteer";

import runTest from './runTest.js';
import mapAsync from "./mapAsync.js";
import loadExperiment from "./loadExperiment.js";
import { summarizeExperiment, printExperimentSummary } from "./summarizeExperiment.js";

export default async (experimentPath = '') => {
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
	});

  const experiment = await loadExperiment(experimentPath);
	const config = {
		numSamples: experiment.numSamples,
		url: experiment.url,
		logLevel: 'silent',
	};
	const runTreatments = mapAsync(runTest(browser, config));

	const results = await runTreatments(experiment.treatments);
	const summary = summarizeExperiment(results);
	printExperimentSummary({ experiment, summary });

	await browser.close();
}