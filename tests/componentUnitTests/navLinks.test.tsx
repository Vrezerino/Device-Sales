import { expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NavLinks from '@/app/ui/dashboard/navLinks';

describe('Navigation', () => {
    it('links exist', () => {
        render(<NavLinks />);

        expect(screen.getByText('Home')).toBeTruthy();
        expect(screen.getByText('Devices')).toBeTruthy();
        expect(screen.getByText('Invoices')).toBeTruthy();
        expect(screen.getByText('Customers')).toBeTruthy();
    });
});