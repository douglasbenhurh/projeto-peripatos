describe('Admin Dashboard', () => {
    beforeEach(() => {
        cy.fixture('users').then((users) => {
            cy.login(users.admin.email, users.admin.password);
        });
    });

    it('should display the dashboard title', () => {
        cy.contains('Acervo').should('be.visible');
    });

    it('should have a "Nova Obra" button', () => {
        cy.contains('+ Nova Obra').should('be.visible');
    });

    it('should display the obras table', () => {
        cy.get('table').should('be.visible');
    });

    it('should display table headers', () => {
        cy.contains('th', 'Obra').should('be.visible');
        cy.contains('th', 'Localização').should('be.visible');
        cy.contains('th', 'Ações').should('be.visible');
    });

    it('should display mock obras in the table', () => {
        cy.contains('O Pensador').should('be.visible');
        cy.contains('Busto de Platão').should('be.visible');
        cy.contains('A Escola de Atenas').should('be.visible');
    });

    it('should display location for each obra', () => {
        cy.contains('Jardim Central').should('be.visible');
        cy.contains('Biblioteca').should('be.visible');
        cy.contains('Hall de Entrada').should('be.visible');
    });

    it('should have action links for each obra', () => {
        // Check for Etiqueta, Editar, and Ver links
        cy.contains('a', 'Etiqueta').should('exist');
        cy.contains('a', 'Editar').should('exist');
        cy.contains('a', 'Ver').should('exist');
    });

    it('should navigate to nova obra form when clicking the button', () => {
        cy.contains('+ Nova Obra').click();
        cy.url().should('include', '/admin/nova-obra');
    });

    it('should navigate to edit form when clicking Editar', () => {
        cy.contains('tr', 'O Pensador').within(() => {
            cy.contains('a', 'Editar').click();
        });
        cy.url().should('match', /\/admin\/editar\/\d+/);
    });

    it('should navigate to label generator when clicking Etiqueta', () => {
        cy.contains('tr', 'O Pensador').within(() => {
            cy.contains('a', 'Etiqueta').click();
        });
        cy.url().should('include', '/admin/etiqueta');
    });

    it('should open obra page in new tab when clicking Ver', () => {
        cy.contains('tr', 'O Pensador').within(() => {
            cy.contains('a', 'Ver').should('have.attr', 'target', '_blank');
        });
    });

    it('should redirect to login if not authenticated', () => {
        cy.clearLocalStorage();
        cy.visit('/admin');
        cy.url().should('include', '/login');
    });
});
