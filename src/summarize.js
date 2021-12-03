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
};

export const summarize = (nums = []) => ({
	min: Math.min(...nums),
	max: Math.max(...nums),
	mean: mean(nums),
	median: median(nums),
	std: std(nums),
});

export const printSummary = (summary) => `\
min: ${summary.min.toFixed(2)} mean: ${summary.mean.toFixed(2)} \
median: ${summary.median.toFixed(2)} std: ${summary.std.toFixed(2)} \
max: ${summary.max.toFixed(2)}\
`;