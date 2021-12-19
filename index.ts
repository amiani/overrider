import runExperiment from "./src/runExperiment.js";

const [experimentPath] = process.argv.slice(2);

runExperiment(experimentPath);