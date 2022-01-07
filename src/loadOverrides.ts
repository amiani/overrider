import fs from 'fs';
import path from 'path';
import type { Override } from './loadExperiment';

export interface OverrideLoaded extends Override {
	file: string;
}

export const loadOverrides = (basePath: string, overrides: Override[]): Promise<OverrideLoaded[]> =>
	Promise.all(
		overrides.map(async config => ({
			...config,
			file: await fs.promises.readFile(path.resolve(basePath, config.localPath), 'utf8')
		}))
	);
