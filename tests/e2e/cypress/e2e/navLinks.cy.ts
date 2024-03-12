describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
  });

  it('panel buttons exists', () => {
    cy.get('.flex.grow.flex-row')
      .should('be.visible')
      .and('contain', 'Home')
      .and('contain', 'Devices')
      .and('contain', 'Invoices')
      .and('contain', 'Customers')
  });

  it('buttons direct to correct pages', () => {
    cy.get('a.flex')
      .eq(1)
      .click()
      .url()
      .should('eq', 'http://localhost:3000/dashboard');

    cy.get('a.flex')
      .eq(2)
      .click()
      .url()
      .should('include', '/devices');

    cy.get('a.flex')
      .eq(3)
      .click()
      .url()
      .should('include', '/invoices');

    cy.get('a.flex')
      .eq(4)
      .click()
      .url()
      .should('include', '/customers');
  });
});