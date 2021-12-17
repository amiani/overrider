export default (overrideConfigs) => async (target) => {
	const page = await target.page();
	if (!(page && overrideConfigs.length)) {
		return;
	}
	await page.setRequestInterception(true);
	page.on("request", intercept(overrideConfigs));
}

const intercept = (overrides = []) => (req) => {
	const url = req.url();
	const override = overrides.find(o =>
		o.remotePath === url && !url.match(o.localPath)
	);
	if (!override) {
		req.continue();
		return;
	}
	return new Promise(resolve =>
		setTimeout(
			() => {
				req.respond({ body: override.file });
				resolve();
			},
			override.delay || 0
		)
	);
}