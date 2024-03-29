describe('Customer table', () => {
    beforeEach(() => {
        cy.visit('/dashboard/customers');
    });

    it('has the expected columns', () => {
        // Check table header cell contents
        cy.get('th').eq(0).contains('Name');
        cy.get('th').eq(1).contains('Email');
        cy.get('th').eq(2).contains('Company');
        cy.get('th').eq(3).contains('Total Invoices');
        cy.get('th').eq(4).contains('Total Pending');
        cy.get('th').eq(5).contains('Total Paid');
    });

    it('customer can be added', () => {
        // Find and click Create Customer button
        const createBtn = cy.get('a.flex.h-10.items-center.rounded-lg.bg-amber-500');
        createBtn.should('have.attr', 'href')
            .and('include', 'create')
            .then((href: any) => {
                cy.visit(href)
            });

        // Fill new customer form
        cy.get('input[name="name"]').type('Zz Cypress Customer');
        cy.get('input[name="email"]').type('cy@cy.com');
        cy.get('input[name="company"]').type('Cypress');
        cy.get('input[type=file]').selectFile('__tests__/e2e/cypress/support/test.jpg')
        cy.get('form').submit();

        // Assert that the last row/device is the one we just created
        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(1)')
            .contains('Zz Cypress Customer');

        // Assert that image exists, i.e. filename is based on the device name
        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(1)')
            .find('img')
            .should('have.attr', 'src')
            .and('contain', 'Zz_Cypress_Customer')
    });

    it('row has edit and delete buttons', () => {
        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(7) a')
            .should('have.attr', 'href')
            .and('include', 'edit');

        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(7) button')
            .should('have.text', 'Delete');
    });

    it('customer can be edited', () => {
        // Find customer edit btn from last row/customer and click on it
        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(7) a')
            .click();

        // Rename customer
        cy.get('input[name="name"]').clear().type('ZQZ Cypresserino');
        cy.get('form').submit();

        // Check from the row that customer name was edited successfully
        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(1)')
            .contains('ZQZ Cypresserino');

        // We are not uploading a new image which should result in the current one being deleted
        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(1)')
            .find('img')
            .should('have.attr', 'src')
            .and('contain', 'blankProfile')
    });

    it('customer can be deleted', () => {
        /* 
          Don't proceed to deleting last row if it's not the one we added before;
          Throw error instead if the row is already missing by evaluating its non-existence
        */
        if (!(cy.contains('ZQZ Cypresserino').should('exist'))) {
            throw new Error('Test row was not found, terminating...');
        }

        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(7) button')
            .click();

        cy.contains('ZQZ Cypresserino').should('not.exist')
    });
});