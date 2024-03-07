import { expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import ReduxProvider from '@/redux/provider';

describe('Dashboard', () => {
    // Asynchronous React components need to be resolved before testing.
    it('cards exist', async () => {
        const ResolvedCardWrapper = await CardWrapper();
        render(ResolvedCardWrapper);

        expect(screen.getByRole('heading', { level: 3, name: 'Collected' })).toBeDefined();
        expect(screen.getByRole('heading', { level: 3, name: 'Pending' })).toBeDefined();
        expect(screen.getByRole('heading', { level: 3, name: 'Total Invoices' })).toBeDefined();
        expect(screen.getByRole('heading', { level: 3, name: 'Total Customers' })).toBeDefined();
    });

    it('revenue chart exists', async () => {
        const ResolvedRevenueChart = await RevenueChart();

        render(<ReduxProvider>{ResolvedRevenueChart}</ReduxProvider>);
        expect(screen.getByText('$0K')).toBeDefined();
    });
});