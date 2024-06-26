describe('Devices table', () => {
    beforeEach(() => {
        cy.visit('/dashboard/devices');
    });

    it('has the expected columns', () => {
        // Check table header cell contents
        cy.get('th').eq(0).contains('Device Name');
        cy.get('th').eq(1).contains('Manufacturer');
        cy.get('th').eq(2).contains('Number');
        cy.get('th').eq(3).contains('Amount');
    });

    it('device can be added', () => {
        // Find and "push" Create Device button
        const createBtn = cy.get('a.flex.h-10.items-center.rounded-lg.bg-amber-500');
        createBtn.should('have.attr', 'href')
            .and('include', 'create')
            .then((href: any) => {
                cy.visit(href)
            });

        // Fill new device form
        cy.get('input[name="deviceName"]').type('Zz Cypresser');
        cy.get('input[name="deviceManufacturer"]').type('Cypress Manufacturing');
        cy.get('input[name="deviceDescription"]').type('Cypress!');
        cy.get('input[name="deviceNumber"]').type('123789');
        cy.get('input[name="amount"]').type('1');
        cy.get('input[type=file]').selectFile('__tests__/e2e/cypress/support/test.jpg')
        cy.get('form').submit();

        // Assert that the last row/device is the one we just created
        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(1)')
            .contains('Zz Cypresser');

        // Assert that image exists, i.e. filename is based on the device name
        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(1)')
            .find('img')
            .should('have.attr', 'src')
            .and('contain', 'Cypresser')
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
        // Find device edit btn from last row/device and click on it
        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(5) a')
            .click();

        // Rename device
        cy.get('input[name="deviceName"]').clear().type('Cypreza');
        cy.get('form').submit();

        // Check from the row that device name was edited successfully
        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(1)')
            .contains('Cypreza');

        // We are not uploading a new image which should result in the current one being deleted
        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(1)')
            .find('img')
            .should('have.attr', 'src')
            .and('contain', 'blankDevice')
    });

    it('device can be deleted', () => {
        cy.get('table')
            .find('tr')
            .last()
            .find('td:nth-child(5) button')
            .click();

        cy.contains('Cypreza').should('not.exist')
    });
});