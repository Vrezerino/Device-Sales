import { expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '../../app/page';

describe('Page', () => {
    it('heading exists', () => {
        render(<Page />);
        expect(screen.getByRole('heading', { level: 2, name: 'Welcome to Device Sales.' })).toBeDefined();
    });
});