import puppeteer from "puppeteer";

import runTreatment from './runTreatment.js';
import mapAsync from "./mapAsync.js";
import loadExperiment from "./loadExperiment.js";
import { summarizeExperiment, printExperimentSummary } from "./summarizeExperiment.js";

export default async (experimentPath = '') => {
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
	});

  const experiment = await loadExperiment(experimentPath);
	const runConfiguredTreatment = runTreatment({
		browser,
		numSamples: experiment.numSamples,
		url: experiment.url,
		logLevel: 'silent',
	});

	const results = await mapAsync(runConfiguredTreatment)(experiment.treatments);
	const summary = summarizeExperiment(results);
	printExperimentSummary({ experiment, summary });

	await browser.close();
}