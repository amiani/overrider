import fs from 'fs';

export interface Override {
	remotePath: string;
	localPath: string;
	delay: number;
}

export interface Intervention {
	name: string;
	overrides?: Override[];
}

export interface ExperimentConfig {
	name: string;
	url: string;
	numSamples: number;
	outputDir: string;
	throttling: {
		up: number;
		down: number;
		rtt: number;
		cpuSlowdownMultiplier: number;
	},
	interventions: Intervention[];
}

const addDefaults = (config: ExperimentConfig): ExperimentConfig => ({
	...config,
	throttling: config.throttling || {
		up: 10240,
		down: 10240,
		rtt: 40,
		cpuSlowdownMultiplier: 1,
	},
})
export default async (configPath = ''): Promise<ExperimentConfig> =>
	fs.promises.readFile(configPath, 'utf8')
		.then(JSON.parse)
		.then(addDefaults);