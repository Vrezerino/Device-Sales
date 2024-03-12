describe('Devices table', () => {
    beforeEach(() => {
        cy.visit('/dashboard/devices');
    });

    it('has the expected columns', () => {
        cy.get('th').eq(0).contains('Device Name');
        cy.get('th').eq(1).contains('Manufacturer');
        cy.get('th').eq(2).contains('Number');
        cy.get('th').eq(3).contains('Amount');
    });

    it('device can be added', () => {
        const createBtn = cy.get('a.flex.h-10.items-center.rounded-lg.bg-amber-500');
        createBtn.should('have.attr', 'href')
            .and('include', 'create')
            .then((href: any) => {
                cy.visit(href)
            });

        cy.get('input[name="deviceName"]').type('Cypress');
        cy.get('input[name="deviceManufacturer"]').type('Cypress Manufacturing');
        cy.get('input[name="deviceDescription"]').type('Cypress!');
        cy.get('input[name="deviceNumber"]').type('123789');
        cy.get('input[name="amount"]').type('1');
        cy.get('input[name="imageUrl"]')
            .type('https://static-00.iconduck.com/assets.00/cypress-icon-2048x2045-rgul477b.png');
        cy.get('form').submit();

        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(1)')
            .contains('Cypress');
    });

    it('row has edit and delete buttons', () => {
        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(5) a')
            .should('have.attr', 'href')
            .and('include', 'edit');

        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(5) button')
            .should('have.text', 'Delete');
    });

    it('device can be edited', () => {
        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(5) a')
            .click();

        cy.get('input[name="deviceName"]').clear().type('Cypress 1');
        cy.get('form').submit();

        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(1)')
            .contains('Cypress 1');
    });

    it('device can be deleted', () => {
        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(5) button')
            .click();

        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(1)')
            .contains('Cypress 1').should('not.exist');
    });
});