export default ({
	experiment,
	summary = []
}) => {
	console.log(`${experiment.name}: ${experiment.numSamples} samples`);
	const output = summary.map((treatmentSummary, i) => `\
		Treatment #${i}: ${experiment.treatments[i].name}
		${printSummary(treatmentSummary.lcp)}
		${printSummary(treatmentSummary.cls)}
		${printSummary(treatmentSummary.tbt)}
	`
}