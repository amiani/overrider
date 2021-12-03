import fs from 'fs';
import path from 'path';
import override from './override.js';

export default async (configPath = '') => {
	const configFile = await fs.promises.readFile(configPath, 'utf8');
	const config = JSON.parse(configFile);

	const createOverride = (intervention) =>
		override
			(intervention.remotePath)
			(path.resolve(path.dirname(configPath), intervention.localPath));

	return {
		...config,
		interventions: config.interventions.map((intervention) => ({
			...intervention,
			override: createOverride(intervention),
		})),
	};
}