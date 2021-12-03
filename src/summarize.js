const mean = (nums = []) => nums.reduce((a, b) => a + b) / nums.length;

const median = (nums = []) => {
	const sorted = nums.sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
};

const variance = (nums = []) => {
	const avg = mean(nums);
	return nums.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / (nums.length - 1);
};

const std = (nums = []) => Math.sqrt(variance(nums));

const mad = (nums = []) => {
	const med = median(nums);
	return median(nums.map(num => Math.abs(num - med)));
};

export const summarize = (nums = []) => ({
	n: nums.length,
	min: Math.min(...nums),
	max: Math.max(...nums),
	mean: mean(nums),
	median: median(nums),
	mad: mad(nums),
	std: std(nums),
});

export const printSummary = (scale = 2) => (summary) => `\
min: ${summary.min.toFixed(scale)} mean: ${summary.mean.toFixed(scale)} \
median: ${summary.median.toFixed(scale)} MAD: ${summary.mad.toFixed(scale)} \
max: ${summary.max.toFixed(scale)}\
`;