type AsyncFunction<T, U> = (arg: T) => Promise<U>;

export default <T, U>
	(asyncF: AsyncFunction<T, U>) =>
	async (args: T[]): Promise<U[]> => {
	const result = [];
	for (const arg of args) {
		result.push(await asyncF(arg));
	}
	return result;
}
