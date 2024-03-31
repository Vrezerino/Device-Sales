import { invoiceReducer } from '../setup';
import { expect } from 'vitest';

describe('Device reducer', () => {
    it('should return initial state', () => {
        expect(invoiceReducer(undefined, { type: 'unknown' })).toEqual({
            invoiceList: [
                {
                    _id: '66088d7f9f9de096ed429a63',
                    name: 'Delba de Oliveira',
                    email: 'delba@oliveira.com',
                    imageUrl: 'https://device-sales-dev.s3.eu-north-1.amazonaws.com/img/customers/delba-de-oliveira.png',
                    amountInCents: 123650,
                    date: '2024-03-30',
                    status: 'paid'
                  },
                  {
                    _id: '66088fe29f9de096ed429a69',
                    name: 'Patrick Park',
                    email: 'abc@gmail.com',
                    imageUrl: 'https://device-sales-dev.s3.eu-north-1.amazonaws.com/img/customers/patrick-park.png',
                    amountInCents: 600000,
                    date: '2024-02-5',
                    status: 'paid'
                  }
            ]
        });
    });
});