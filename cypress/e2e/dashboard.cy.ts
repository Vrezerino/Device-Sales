describe('Dashboard', () => {
    beforeEach(() => {
        cy.visit('/dashboard');
    });

    it('elements exist', () => {
        cy.contains('Dashboard');
        cy.contains('Collected');
        cy.contains('Pending');
        cy.contains('Total Invoices');
        cy.contains('Total Customers');
        cy.contains('Recent Revenue');
        cy.contains('Latest Invoices');
    });
});