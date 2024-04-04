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
    it('cards exist and data is fetched', () => {
        render(<ReduxMockProvider><CardWrapper /></ReduxMockProvider>);

        expect(screen.getByRole('heading', { level: 3, name: 'Collected' })).toBeDefined();
        expect(screen.getByRole('heading', { level: 3, name: 'Pending' })).toBeDefined();
        expect(screen.getByRole('heading', { level: 3, name: 'Total Invoices' })).toBeDefined();
        expect(screen.getByRole('heading', { level: 3, name: 'Total Customers' })).toBeDefined();
    });

    it('revenue chart exists and data is fetched', () => {
        render(<ReduxMockProvider><RevenueChart /></ReduxMockProvider>);
        expect(screen.getByText('$6K')).toBeTruthy();
    });
});

afterAll(async () => {
    await clearDb();
})