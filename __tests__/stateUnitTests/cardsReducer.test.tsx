import { CardsData } from '@/app/lib/definitions';
import { cardsReducer } from '../setup';
import { CardsState, setCardsData } from '@/redux/features/cardsSlice';
import { expect } from 'vitest';

describe('Cards reducer', () => {
    it('should return initial state', () => {
        expect(cardsReducer(undefined, { type: 'unknown' })).toEqual({
            cardsData: {}
        });
    });

    it('should handle cards data being added', () => {
        const data = {
            numberOfCustomers: 5,
            numberOfInvoices: 40,
            totalPendingInvoices: '$6060',
            totalPaidInvoices: '$884',
        };

        const previousState: CardsState = {
            cardsData: {} as CardsData
        };

        expect(cardsReducer(previousState, setCardsData(data))).toEqual(
            {
                cardsData: {
                    numberOfCustomers: 5,
                    numberOfInvoices: 40,
                    totalPendingInvoices: '$6060',
                    totalPaidInvoices: '$884',
                }
            }
        );
    });
});