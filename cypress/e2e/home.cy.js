describe('Home Page', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should display the welcome message', () => {
        cy.contains('Bem-vindo').should('be.visible');
    });

    it('should display instructions to scan QR code', () => {
        cy.contains('Aponte sua câmera para o QR Code').should('be.visible');
    });

    it('should have a camera icon', () => {
        cy.get('[role="img"][aria-label="camera"]').should('be.visible');
    });

    it('should have a link to the scanner page', () => {
        cy.contains('Abrir Scanner').should('be.visible').and('have.attr', 'href', '/scan');
    });

    it('should navigate to scan page when clicking the scanner link', () => {
        cy.contains('Abrir Scanner').click();
        cy.url().should('include', '/scan');
    });

    it('should navigate to scan page when clicking the camera icon', () => {
        cy.get('[role="img"][aria-label="camera"]').click();
        cy.url().should('include', '/scan');
    });
});
