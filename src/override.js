import fs from 'fs';

export default (remotePath = '') => (localPath = '') => async (target) => {
	const page = await target.page();
	if (page) {
		await page.setRequestInterception(true);
		page.on("request", intercept({ remotePath, localPath }));
	}
}

const intercept = ({ remotePath = '', localPath = '' }) => (req) => {
	const url = req.url();

	if (url === remotePath && !url.match(localPath)) {
		console.log(`replacing ${remotePath} with ${localPath}`);
		req.respond({ body: fs.readFileSync(localPath)});
	} else {
		req.continue();
	}
}