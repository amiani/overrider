import fs from 'fs';
import path from 'path';
import override from './override.js';

const createTreatment = (basePath = '') => async (treatment) => {
	const localPathAbsolute = path.resolve(basePath, treatment.localPath);
	const file = await fs.promises.readFile(localPathAbsolute, 'utf8');
	return override(treatment.remotePath)(file);
}

export default async (configPath = '') => {
	const configFile = await fs.promises.readFile(configPath, 'utf8');
	const config = JSON.parse(configFile);
	const createTreatmentRelative = createTreatment(path.dirname(configPath));
	return {
		...config,
		baseline: await createTreatmentRelative(config.baseline),
		treatments: await Promise.all(config.treatments.map(createTreatmentRelative)),
	};
}