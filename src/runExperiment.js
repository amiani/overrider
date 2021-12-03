import puppeteer from "puppeteer";

import runIntervention from './runIntervention.js';
import mapAsync from "./mapAsync.js";
import loadExperiment from "./loadExperiment.js";
import { summarizeExperiment, printExperimentSummary } from "./summarizeExperiment.js";

export default async (experimentPath = '') => {
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
	});

  const experiment = await loadExperiment(experimentPath);
	const runConfiguredIntervention = runIntervention({
		browser,
		numSamples: experiment.numSamples,
		url: experiment.url,
		logLevel: 'silent',
	});

	const results = await mapAsync(runConfiguredIntervention)(experiment.interventions);
	const summary = summarizeExperiment(results);
	printExperimentSummary({ experiment, summary });

	await browser.close();
}