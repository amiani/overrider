const mean = (arr = []) => arr.reduce((a, b) => a + b) / arr.length;
const median = (arr = []) => {
	const sorted = arr.sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
};
const std = (arr = []) => {
	const avg = mean(arr);
	const variance = arr.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / (arr.length - 1);
	return Math.sqrt(variance);
}

export default (nums = []) => ({
	min: Math.min(...nums),
	max: Math.max(...nums),
	mean: mean(nums),
	median: median(nums),
	std: std(nums),
	toString() {
		return `min: ${this.min.toFixed(2)} mean: ${this.mean.toFixed(2)}\
 median: ${this.median.toFixed(2)} std: ${this.std.toFixed(2)}\
 max: ${this.max.toFixed(2)}`;
	},
})
