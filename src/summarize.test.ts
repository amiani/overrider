import * as fc from 'fast-check';
import { mean } from './summarize';

describe('mean', () => {
	it('should return a value between the min and max of its inputs', () => fc.assert(
		fc.property(
			fc.array(fc.float(), { minLength: 1 }),
			list => {
				const avg = mean(list);
				return avg >= Math.min(...list) && avg <= Math.max(...list);
			}
		)
	));

	it('should throw when passed an empty array', () => {
		expect(() => mean([])).toThrow();
	})
});