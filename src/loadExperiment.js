import fs from 'fs';
import path from 'path';
import override from './override.js';

export default async (configPath = '') => {
	const configFile = await fs.promises.readFile(configPath, 'utf8');
	const config = JSON.parse(configFile);

	const createOverride = (treatment) =>
		override
			(treatment.remotePath)
			(path.resolve(path.dirname(configPath), treatment.localPath));

	return {
		...config,
		treatments: config.treatments.map((treatment) => ({
			...treatment,
			override: createOverride(treatment),
		})),
	};
}