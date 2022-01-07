import throttle from "@sitespeed.io/throttle";
import path from 'path';

import runIntervention from './runIntervention';
import mapAsync from "./mapAsync";
import loadExperiment from "./loadExperiment";
import { summarizeExperiment, printExperimentSummary } from "./summarizeExperiment";
import { DESKTOP_EMULATION_METRICS, DESKTOP_USERAGENT, desktopDense4G, NO_THROTTLING } from "./constants";
import Config from 'lighthouse/types/config';

const desktopConfig: Config.Json = {
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

export default async (experimentConfigPath: string) => {
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
	
	try {
		await throttle.start(experimentConfig.throttling);
		const results = await mapAsync(runInterventionConfigured)(experimentConfig.interventions);
		const summary = summarizeExperiment(results);
		printExperimentSummary(experimentConfig, summary);
	} catch (err) {
		console.error(err);
	} finally {
		await throttle.stop();
	}

}