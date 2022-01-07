// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import lighthouse from "lighthouse";
import puppeteer, { Browser, Target } from "puppeteer";
import { URL } from "url";
import fs from "fs"
import path from "path";
import { RunnerResult } from 'lighthouse/types/externs';
import type Config from 'lighthouse/types/config';

import initOverrides from './initOverrides';
import type { Intervention } from './loadExperiment';
import { loadOverrides } from './loadOverrides';


const createBrowser = (chromePath = undefined): Promise<Browser> =>
	puppeteer.launch({
		executablePath: chromePath,
		headless: true,
		defaultViewport: null,
		args: [
			"--disable-web-security",
		]
	});

interface LighthouseParams {
	url: string;
	port: string;
	logLevel: string;
	lighthouseConfig: Config.Json;
}

const sample = ({ url, port, logLevel, lighthouseConfig }: LighthouseParams): RunnerResult =>
	lighthouse(
		url,
		{
			port,
			output: "json",
			logLevel,
		},
		lighthouseConfig
	);

const saveResult = async (dir: string, name: string, result: RunnerResult) => {
	!fs.existsSync(dir) && await fs.promises.mkdir(dir);
	await fs.promises.writeFile(path.join(dir, `${name}.json`), JSON.stringify(result, null, 2));
};

interface InterventionOptions {
	numSamples: number;
	url: string;
	lighthouseConfig: Config.Json;
	logLevel: "info" | "silent"
	experimentDir: string;
	outDir: string
}

export default ({
	numSamples = 2,
	url = "https://www.retailmenot.com/view/kohls.com",
	lighthouseConfig,
	logLevel = "info",
	experimentDir,
	outDir,
}: InterventionOptions) =>
async (intervention: Intervention) => {
	console.log(`Running intervention: ${intervention.name}`);
	const results = [];
	for (let i = 0; i < numSamples; i++) {
		let browser;
		try {
			browser = await createBrowser();
			//wrong level of detail here... hard to read
			if (intervention.overrides) {
				const overrideConfigs = await loadOverrides(experimentDir, intervention.overrides);
				browser.on("targetcreated", initOverrides(overrideConfigs));
			}
			const result = await sample({
				url,
				port: new URL(browser.wsEndpoint()).port,
				logLevel,
				lighthouseConfig,
			});
			results.push(result);
			outDir && await saveResult(outDir, `intervention-${intervention.name}-${i}`, result);
		}
		catch (e) {
			console.error(e);
		}
		finally {
			browser && await browser.close();
		}
	}
	return results;
}
