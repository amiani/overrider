import puppeteer from "puppeteer";
import throttle from "@sitespeed.io/throttle";
import fs from 'fs';
import path from 'path';

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
	
	//await throttle.start({ up: 10 * 1024, down: 10 * 1024, rtt: 40 });
	const results = await mapAsync(runConfiguredIntervention)(experiment.interventions);
	const summary = summarizeExperiment(results);
	const resultDirPath = path.join(path.dirname(experimentPath), `results_${new Date().getTime()}`);
	await fs.promises.mkdir(resultDirPath);
	await fs.promises.writeFile(path.join(resultDirPath, 'summary.json'), JSON.stringify(summary, null, 2));
	//await throttle.stop();

	printExperimentSummary({ experiment, summary });

	await browser.close();
}