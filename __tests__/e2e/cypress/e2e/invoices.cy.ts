describe('Invoices table', () => {
    beforeEach(() => {
        cy.visit('/dashboard/invoices');
    });

    it('has the expected columns', () => {
        // Check table header cell contents
        cy.get('th').eq(0).contains('Customer');
        cy.get('th').eq(1).contains('Email');
        cy.get('th').eq(2).contains('Amount');
        cy.get('th').eq(3).contains('Date');
        cy.get('th').eq(4).contains('Status');
    });

    it('invoice can be added', () => {
        // Find and "push" Create Invoice button
        const createBtn = cy.get('a.flex.h-10.items-center.rounded-lg.bg-amber-500');
        createBtn.should('have.attr', 'href')
            .and('include', 'create')
            .then((href: any) => {
                cy.visit(href)
            });

        // Fill new invoice form
        cy.get('select[name="customerId"]').select(1);
        cy.get('input[name="amount"]').type('549282');
        cy.get('input[type="radio"]').first().check();
        cy.get('form').submit();

        cy.visit('/dashboard/invoices');
        // Check that the last row/invoice is the one we just created
        cy.get('tr')
            .last()
            .find('td:nth-child(3)')
            .contains('$549,282');
    });

    it('row has edit and delete buttons', () => {
        cy.visit('/dashboard/invoices');
        cy.get('tr')
            .last()
            .find('td:nth-child(6) a')
            .should('have.attr', 'href')
            .and('include', 'edit');

        cy.get('tr')
            .last()
            .find('td:nth-child(6) button')
            .should('have.text', 'Delete');
    });

    it('invoice can be edited', () => {
        // Find edit invoice btn from last row/invoice and click on it
        cy.get('tr')
            .last()
            .find('td:nth-child(6) a')
            .click();

        // Edit invoice due amount
        cy.get('input[name="amount"]').clear().type('444008');
        cy.get('form').submit();

        cy.visit('/dashboard/invoices');
        // Check that the amount was edited successfully
        cy.get('tr')
            .last()
            .find('td:nth-child(3)')
            .contains('$444,008');
    });

    it('invoice can be deleted', () => {
        cy.get('tr')
            .last()
            .find('td:nth-child(6) button')
            .click();

        cy.visit('/dashboard/invoices');

        cy.get('tr')
            .last()
            .find('td:nth-child(3)')
            .contains('$444,008').should('not.exist');
    });
});