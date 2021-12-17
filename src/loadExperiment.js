import fs from 'fs';

export default async (configPath = '') =>
	fs.promises.readFile(configPath, 'utf8')
		.then(JSON.parse)