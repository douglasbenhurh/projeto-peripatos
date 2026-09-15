describe('Scan Page', () => {
    beforeEach(() => {
        cy.visit('/scan');
    });

    it('should display the scan page title', () => {
        cy.contains('Scan QR Code').should('be.visible');
    });

    it('should display instructions', () => {
        cy.contains('Point your camera at a QR code').should('be.visible');
    });

    it('should have a back to home link', () => {
        cy.contains('Back to Home').should('be.visible').and('have.attr', 'href', '/');
    });

    it('should navigate back to home when clicking the link', () => {
        cy.contains('Back to Home').click();
        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should display the QR scanner component', () => {
        // The QR scanner should render (checking for the container)
        cy.get('#reader').should('exist');
    });
});
