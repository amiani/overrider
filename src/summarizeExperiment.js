import { summarize, printSummary } from "./summarize.js";

const getCWV = (result) => ({
	lcp: result.lhr.audits['largest-contentful-paint'].numericValue / 1000,
	cls: result.lhr.audits['cumulative-layout-shift'].numericValue,
	tbt: result.lhr.audits['total-blocking-time'].numericValue,
});

const appendTrial = (cwv, trial) => ({
	lcp: [...cwv.lcp, trial.lcp],
	cls: [...cwv.cls, trial.cls],
	tbt: [...cwv.tbt, trial.tbt],
});

const aggregateCWV = (intervention) =>
	intervention
		.map(getCWV)
		.reduce(appendTrial, { lcp: [], cls: [], tbt: [] });
		
const summarizeIntervention = (intervention) => ({
	lcp: summarize(intervention.lcp),
	cls: summarize(intervention.cls),
	tbt: summarize(intervention.tbt),
});

export const summarizeExperiment = (results) => results
	.map(aggregateCWV)
	.map(summarizeIntervention);


export const printExperimentSummary = ({
	experiment,
	summary = []
}) => {
	console.log(`\nExperiment summary\n ${experiment.name}\n Sample size: ${experiment.numSamples}`);

	const output = summary.map((interventionSummary, i) => `
Intervention #${i}: ${experiment.interventions[i].name}
LCP: ${printSummary(2)(interventionSummary.lcp)}
CLS: ${printSummary(4)(interventionSummary.cls)}
TBT: ${printSummary(2)(interventionSummary.tbt)}
`);

	output.map((intervention) => console.log(intervention));
}