import throttle from "@sitespeed.io/throttle";
import path from 'path';

import runIntervention from './runIntervention.js';
import mapAsync from "./mapAsync.js";
import loadExperiment from "./loadExperiment.js";
import { summarizeExperiment, printExperimentSummary } from "./summarizeExperiment.js";
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
		throttlingMethod: 'devtools',
		throttling: NO_THROTTLING,
		//maxWaitForLoad: 10000,
	},
};

export default async (experimentConfigPath = '') => {
  const experimentConfig = await loadExperiment(experimentConfigPath);
	const outDir = path.join(path.dirname(experimentConfigPath), `results_${new Date().getTime()}`);
	const lighthouseConfig = {
		...desktopConfig,
		throttling: {
			...NO_THROTTLING,
			cpuSlowdownMultiplier: experimentConfig.throttling.cpuSlowdownMultiplier,
		}
	};
	const runInterventionConfigured = runIntervention({
		numSamples: experimentConfig.numSamples,
		url: experimentConfig.url,
		logLevel: 'silent',
		experimentDir: path.dirname(experimentConfigPath),
		outDir,
		lighthouseConfig
	});
	
	let results;
	try {
		await throttle.start(experimentConfig.throttling);
		results = await mapAsync(runInterventionConfigured)(experimentConfig.interventions);
	} catch (err) {
		console.error(err);
	} finally {
		await throttle.stop();
	}

	const summary = summarizeExperiment(results);
	printExperimentSummary({ experiment: experimentConfig, summary });
}