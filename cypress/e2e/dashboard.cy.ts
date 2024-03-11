describe('Dashboard', () => {
  it('navigation exists', () => {
    cy.visit('/');

    cy.get('flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2')
      .should('be.visible')
      .and('contain', 'Home')
      .and('contain', 'Devices')
      .and('contain', 'Invoices')
      .and('contain', 'Customers')
  });

  /*
  it('elements exist', () => {
    cy.visit('/dashboard');

    cy.contains('Dashboard');
    cy.contains('Collected');
    cy.contains('Pending');
    cy.contains('Total Invoices');
    cy.contains('Total Customers');
  });
  */
});