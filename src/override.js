import fs from 'fs';

export default (remotePath = '') => (localPath = '') => async (target) => {
	const page = await target.page();
	if (page) {
		await page.setRequestInterception(true);
		const file = await fs.promises.readFile(localPath, 'utf8');
		page.on("request", intercept({ remotePath, localPath, file }));
	}
}

const intercept = ({ remotePath = '', localPath = '', file }) => (req) => {
	const url = req.url();
	if (url === remotePath && !url.match(localPath)) {
		//console.log(`replacing ${remotePath} with ${localPath}`);
		req.respond({ body: file });
	} else {
		req.continue();
	}
}