import type { HTTPRequest, Target } from 'puppeteer';
import { OverrideLoaded } from './loadOverrides';

export default (overrideConfigs: OverrideLoaded[]) => async (target: Target) => {
	const page = await target.page();
	if (!(page && overrideConfigs.length)) {
		return;
	}
	await page.setRequestInterception(true);
	page.on("request", intercept(overrideConfigs));
}

const intercept = (overrides: OverrideLoaded[]) => (req: HTTPRequest) => {
	const url = req.url();
	const override = overrides.find(o =>
		o.remotePath === url && !url.match(o.localPath)
	);
	if (!override) {
		req.continue();
		return;
	}
	return new Promise<void>(resolve =>
		setTimeout(
			() => {
				req.respond({ body: override.file });
				resolve();
			},
			override.delay || 0
		)
	);
}