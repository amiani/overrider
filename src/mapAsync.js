export default (asyncFn) => async (args = []) => {
	const result = [];
	for (const arg of args) {
		result.push(await asyncFn(arg));
	}
	return result;
}
