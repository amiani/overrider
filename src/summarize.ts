export const mean = (nums: number[]) => {
	return nums.reduce((a, b) => a + b, 0) / nums.length;
}

const median = (nums: number[]) => {
	const sorted = nums.sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 0
		? (sorted[mid - 1] + sorted[mid]) / 2
		: sorted[mid];
};

const variance = (nums: number[]) => {
	const avg = mean(nums);
	return nums.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / (nums.length - 1);
};

const std = (nums: number[]) => Math.sqrt(variance(nums));

const mad = (nums: number[]) => {
	const med = median(nums);
	const distances = nums.map(num => Math.abs(num - med));
	return median(distances);
};

export interface Summary {
	n: number;
	min: number;
	max: number;
	mean: number;
	median: number;
	mad: number;
	std: number;
}

export const summarize = (nums: number[]): Summary => ({
	n: nums.length,
	min: Math.min(...nums),
	max: Math.max(...nums),
	mean: mean(nums),
	median: median(nums),
	mad: mad(nums),
	std: std(nums),
});

export const printSummary = (scale = 2) => (summary: Summary) => `\
min: ${summary.min.toFixed(scale)} mean: ${summary.mean.toFixed(scale)} \
median: ${summary.median.toFixed(scale)} MAD: ${summary.mad.toFixed(scale)} \
max: ${summary.max.toFixed(scale)}\
`;