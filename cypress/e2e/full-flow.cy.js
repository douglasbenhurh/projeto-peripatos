describe('Full Application Flow', () => {
    it('should complete the full workflow: login → create obra → generate label → view obra', () => {
        // Step 1: Login as admin
        cy.fixture('users').then((users) => {
            cy.login(users.admin.email, users.admin.password);
        });

        // Step 2: Navigate to create new obra
        cy.contains('+ Nova Obra').click();
        cy.url().should('include', '/admin/nova-obra');

        // Step 3: Fill in the obra form
        const novaObra = {
            titulo: 'Teste E2E Obra',
            localizacao: 'Sala de Testes',
            descricao: 'Uma obra criada durante teste E2E',
            texto: 'Este é o texto completo da obra de teste.'
        };

        cy.get('#titulo').type(novaObra.titulo);
        cy.get('#localizacao').type(novaObra.localizacao);
        cy.get('#descricao').type(novaObra.descricao);
        cy.get('#texto').type(novaObra.texto);

        // Step 4: Save the obra
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/admin');

        // Step 5: Verify obra appears in dashboard (mock data, so we check for existing obra)
        cy.contains('O Pensador').should('be.visible');

        // Step 6: Generate label for an obra
        cy.contains('tr', 'O Pensador').within(() => {
            cy.contains('a', 'Etiqueta').click();
        });

        cy.url().should('include', '/admin/etiqueta');
        cy.contains('Peripatos').should('be.visible');
        cy.get('svg').should('exist'); // QR code

        // Step 7: Go back to dashboard
        cy.contains('button', 'Voltar').click();
        cy.url().should('include', '/admin');

        // Step 8: View the obra as a visitor would
        cy.contains('tr', 'O Pensador').within(() => {
            cy.contains('a', 'Ver').invoke('removeAttr', 'target').click();
        });

        cy.url().should('include', '/obra?id=1');
        cy.contains('O Pensador').should('be.visible');
        cy.get('audio').should('exist');

        // Step 9: Navigate back to home
        cy.visit('/');
        cy.contains('Bem-vindo').should('be.visible');
    });

    it('should handle visitor flow: home → scan page', () => {
        cy.visit('/');
        cy.contains('Abrir Scanner').click();
        cy.url().should('include', '/scan');
        cy.contains('Scan QR Code').should('be.visible');
    });

    it('should protect admin routes from unauthenticated access', () => {
        cy.clearLocalStorage();

        // Try to access admin dashboard
        cy.visit('/admin');
        cy.url().should('include', '/login');

        // Try to access nova obra
        cy.visit('/admin/nova-obra');
        cy.url().should('include', '/login');

        // Try to access edit obra
        cy.visit('/admin/editar/1');
        cy.url().should('include', '/login');

        // Try to access label generator
        cy.visit('/admin/etiqueta?id=1');
        cy.url().should('include', '/login');
    });

    it('should allow navigation between all public pages', () => {
        // Home to Scan
        cy.visit('/');
        cy.contains('Abrir Scanner').click();
        cy.url().should('include', '/scan');

        // Scan back to Home
        cy.contains('Back to Home').click();
        cy.url().should('eq', Cypress.config().baseUrl + '/');

        // Home to Obra (direct)
        cy.visit('/obra?id=1');
        cy.contains('O Pensador').should('be.visible');

        // Obra to Home (via navigation)
        cy.visit('/');
        cy.contains('Bem-vindo').should('be.visible');
    });
});
