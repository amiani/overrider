import runExperiment from "./src/runExperiment";

const [experimentPath] = process.argv.slice(2);

runExperiment(experimentPath);