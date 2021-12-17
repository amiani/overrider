import throttle from "@sitespeed.io/throttle";
import path from 'path';

import runIntervention from './runIntervention.js';
import mapAsync from "./mapAsync.js";
import loadExperiment from "./loadExperiment.js";
import { summarizeExperiment, printExperimentSummary } from "./summarizeExperiment.js";

export default async (experimentConfigPath = '', outPath) => {
  const experiment = await loadExperiment(experimentConfigPath);
	const outDir = path.join(path.dirname(experimentConfigPath), `results_${new Date().getTime()}`);
	const runInterventionConfigured = runIntervention({
		numSamples: experiment.numSamples,
		url: experiment.url,
		logLevel: 'silent',
		experimentDir: path.dirname(experimentConfigPath),
		outDir
	});
	

	let results;
	try {
		await throttle.start({ up: 10 * 1024, down: 10 * 1024, rtt: 40 });
		results = await mapAsync(runInterventionConfigured)(experiment.interventions);
	} catch (err) {
		console.error(err);
	} finally {
		await throttle.stop();
	}

	const summary = summarizeExperiment(results);
	printExperimentSummary({ experiment, summary });
}