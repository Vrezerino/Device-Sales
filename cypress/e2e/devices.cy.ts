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

    it('first row/device has the expected values', () => {
        cy.get('td').eq(0).contains('Pluribus');
        cy.get('td').eq(1).contains('BBN');
        cy.get('td').eq(2).contains('785697845067');
        cy.get('td').eq(3).contains('19');
    });

    it('row has edit and delete buttons', () => {
        cy.get('td')
            .eq(4)
            .find('a')
            .should('have.attr', 'href')
            .and('include', 'edit');

        cy.get('td')
            .eq(4)
            .find('button span')
            .should('have.text', 'Delete')
    });
});