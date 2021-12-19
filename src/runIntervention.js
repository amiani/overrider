import puppeteer from "puppeteer";
import lighthouse from "lighthouse";
import { URL } from "url";
import fs from "fs"
import path from "path";
import initOverrides from './initOverrides.js';


const createBrowser = (initOverrides, chromePath = undefined) =>
	puppeteer.launch({
		executablePath: chromePath,
		headless: true,
		defaultViewport: null,
		args: [
			"--disable-web-security",
		]
	})
	.then(b => (b.on("targetcreated", initOverrides), b));

const loadOverrides = (basePath = '', overrideConfigs = []) => Promise.all(
	overrideConfigs.map(async config => ({
		...config,
		file: await fs.promises.readFile(path.resolve(basePath, config.localPath), 'utf8')
	}))
);

const sample = ({ url, port, logLevel, lighthouseConfig, }) =>
	lighthouse(
		url,
		{
			port,
			output: "json",
			logLevel,
		},
		lighthouseConfig
	);

const saveResult = async ({ dir, name, result }) => {
	!fs.existsSync(dir) && await fs.promises.mkdir(dir);
	await fs.promises.writeFile(path.join(dir, `${name}.json`), JSON.stringify(result, null, 2));
};

export default ({
	numSamples = 2,
	url = "https://www.retailmenot.com/view/kohls.com",
	lighthouseConfig,
	logLevel = "info",
	experimentDir,
	outDir,
}) =>
async (intervention) => {
	console.log(`Running intervention: ${intervention.name}`);
	const overrideConfigs = await loadOverrides(experimentDir, intervention.overrides);
	const results = [];
	for (let i = 0; i < numSamples; i++) {
		let browser;
		try {
			browser = await createBrowser(initOverrides(overrideConfigs));
			const result = await sample({
				url,
				port: new URL(browser.wsEndpoint()).port,
				logLevel,
				lighthouseConfig,
			});
			results.push(result);
			outDir && await saveResult({ dir: outDir, name: `intervention-${intervention.name}-${i}`, result });
		}
		catch (e) {
			console.error(e);
		}
		finally {
			await browser.close();
		}
	}
	return results;
}
