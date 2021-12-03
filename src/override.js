export default (remotePath = '') => (file) => async (target) => {
	const page = await target.page();
	if (page) {
		await page.setRequestInterception(true);
		page.on("request", intercept({ remotePath, file }));
	}
}

const intercept = ({ remotePath = '', file }) => (req) => {
	const url = req.url();

	if (url === remotePath /*&& !url.match(localPath)*/) {
		//console.log(`replacing ${remotePath} with ${localFile.}`);
		req.respond({ body: file });
	} else {
		req.continue();
	}
}