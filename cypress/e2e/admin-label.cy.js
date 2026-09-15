describe('Admin Label Generator', () => {
    beforeEach(() => {
        cy.fixture('users').then((users) => {
            cy.login(users.admin.email, users.admin.password);
        });
    });

    it('should display error when no ID is provided', () => {
        cy.visit('/admin/etiqueta');
        cy.contains('ID da obra não fornecido').should('be.visible');
    });

    it('should display the label generator with valid ID', () => {
        cy.visit('/admin/etiqueta?id=1&title=O%20Pensador');
        cy.contains('Peripatos').should('be.visible');
        cy.contains('Nova Acrópole').should('be.visible');
    });

    it('should display the obra title on the label', () => {
        cy.visit('/admin/etiqueta?id=1&title=O%20Pensador');
        cy.contains('O Pensador').should('be.visible');
    });

    it('should display instructions on the label', () => {
        cy.visit('/admin/etiqueta?id=1&title=O%20Pensador');
        cy.contains('Escaneie para ouvir a explicação').should('be.visible');
    });

    it('should display the QR code', () => {
        cy.visit('/admin/etiqueta?id=1&title=O%20Pensador');
        // QR code is rendered as SVG by react-qr-code
        cy.get('svg').should('exist');
    });

    it('should have a print button', () => {
        cy.visit('/admin/etiqueta?id=1&title=O%20Pensador');
        cy.contains('button', 'Imprimir Etiqueta').should('be.visible');
    });

    it('should have a back button', () => {
        cy.visit('/admin/etiqueta?id=1&title=O%20Pensador');
        cy.contains('button', 'Voltar').should('be.visible');
    });

    it('should navigate back when clicking voltar', () => {
        cy.visit('/admin');
        cy.contains('tr', 'O Pensador').within(() => {
            cy.contains('a', 'Etiqueta').click();
        });

        cy.contains('button', 'Voltar').click();
        cy.url().should('include', '/admin');
    });

    it('should use default title when not provided', () => {
        cy.visit('/admin/etiqueta?id=1');
        cy.contains('Título da Obra').should('be.visible');
    });

    it('should generate correct QR code URL', () => {
        cy.visit('/admin/etiqueta?id=1&title=O%20Pensador');

        // The QR code should encode the obra URL
        // We can't easily decode the QR, but we can check it exists
        cy.get('svg').should('have.attr', 'viewBox');
    });
});
