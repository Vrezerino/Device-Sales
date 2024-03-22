import { expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenueChart';
import { ReduxMockProvider } from '../setup';
import { clearDb, initDb } from '@/services/testing';

beforeAll(async () => {
    await initDb();
});

describe('Dashboard', () => {
    // Asynchronous React components need to be resolved before testing.
    it('cards exist and data is fetched', async () => {
        const ResolvedCardWrapper = await CardWrapper();
        render(ResolvedCardWrapper);

        expect(screen.getAllByText('$', { exact: false })).toHaveLength(2);
        expect(screen.getByRole('heading', { level: 3, name: 'Collected' })).toBeDefined();
        expect(screen.getByRole('heading', { level: 3, name: 'Pending' })).toBeDefined();
        expect(screen.getByRole('heading', { level: 3, name: 'Total Invoices' })).toBeDefined();
        expect(screen.getByRole('heading', { level: 3, name: 'Total Customers' })).toBeDefined();
    });

    it('revenue chart exists and data is fetched', () => {
        render(<ReduxMockProvider><RevenueChart /></ReduxMockProvider>);
        expect(screen.getByText('$4K')).toBeTruthy();
    });
});

afterAll(async () => {
    await clearDb();
})