const getLCP = (result) => result.lhr.audits['largest-contentful-paint'].numericValue / 1000;
import summarize from "./summarize.js";

export default (results) =>
	results
		.map((result) => result.map(getLCP))
		.map(summarize)
		.forEach((result) => console.log(result.toString()));
