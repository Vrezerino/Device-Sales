import { revenueReducer } from '../setup';

describe('Device reducer', () => {
    it('should return initial state', () => {
        expect(revenueReducer(undefined, { type: 'unknown' })).equal({
            revenueList: [
                { month: 'Jan', revenue: 3200 },
                { month: 'Feb', revenue: 4000 }
            ]
        });
    });
});