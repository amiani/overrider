import summarize from "./summarize.js";

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

const aggregateCWV = (treatment) =>
	treatment
		.map(getCWV)
		.reduce(appendTrial, { lcp: [], cls: [], tbt: [] })
		
const summarizeTreatment = (treatment) => ({
	lcp: summarize(treatment.lcp),
	cls: summarize(treatment.cls),
	tbt: summarize(treatment.tbt),
});

export default (results) => results
	.map(aggregateCWV)
	.map(summarizeTreatment);