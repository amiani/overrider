import { RunnerResult } from 'lighthouse/types/externs';
import { ExperimentConfig } from './loadExperiment';
import { Summary } from './summarize';
import { summarize, printSummary } from "./summarize";

interface CWV {
	lcp?: number;
	cls?: number;
	tbt?: number;
}

const getCWV = (result: RunnerResult): CWV => {
	const lcp = result.lhr.audits['largest-contentful-paint'].numericValue;
	return {
		lcp: lcp ? lcp / 1000 : undefined,
		cls: result.lhr.audits['cumulative-layout-shift'].numericValue,
		tbt: result.lhr.audits['total-blocking-time'].numericValue,
	}
};

interface AggregatedCWV {
	lcp: number[];
	cls: number[];
	tbt: number[];
}

const appendTrial = (aggCWV: AggregatedCWV, trial: CWV) => ({
	lcp: trial.lcp ? [...aggCWV.lcp, trial.lcp] : aggCWV.lcp,
	cls: trial.cls ? [...aggCWV.cls, trial.cls] : aggCWV.cls,
	tbt: trial.tbt ? [...aggCWV.tbt, trial.tbt] : aggCWV.tbt,
});

const aggregateCWV = (intervention: RunnerResult[]): AggregatedCWV =>
	intervention
		.map(getCWV)
		.reduce<AggregatedCWV>(appendTrial, { lcp: [], cls: [], tbt: [] });
		
interface InterventionSummary {
	lcp: Summary;
	cls: Summary;
	tbt: Summary;
}

const summarizeIntervention = (intervention: AggregatedCWV) => ({
	lcp: summarize(intervention.lcp),
	cls: summarize(intervention.cls),
	tbt: summarize(intervention.tbt),
});

export const summarizeExperiment = (results: RunnerResult[][]): InterventionSummary[]  => results
	.map(aggregateCWV)
	.map(summarizeIntervention);

export const printExperimentSummary = (
	experiment: ExperimentConfig,
	summary: InterventionSummary[]
) => {
	console.log(`\nExperiment summary\n ${experiment.name}\n Sample size: ${experiment.numSamples}`);

	const output = summary.map((interventionSummary, i) => `
Intervention #${i}: ${experiment.interventions[i].name}
LCP: ${printSummary(2)(interventionSummary.lcp)}
CLS: ${printSummary(4)(interventionSummary.cls)}
TBT: ${/*printSummary(2)(interventionSummary.tbt)*/''}
`);

	output.map((intervention) => console.log(intervention));
}
