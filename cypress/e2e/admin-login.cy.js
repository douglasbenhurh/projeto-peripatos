describe('Admin Login', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit('/login');
    });

    it('should display the login form', () => {
        cy.contains('O Escriba').should('be.visible');
        cy.contains('Acesso restrito aos tutores').should('be.visible');
    });

    it('should have email and password fields', () => {
        cy.get('#email').should('be.visible');
        cy.get('#password').should('be.visible');
    });

    it('should have a submit button', () => {
        cy.get('button[type="submit"]').should('be.visible').and('contain', 'Entrar');
    });

    it('should login successfully with valid credentials', () => {
        cy.fixture('users').then((users) => {
            cy.get('#email').type(users.admin.email);
            cy.get('#password').type(users.admin.password);
            cy.get('button[type="submit"]').click();

            // Should redirect to admin dashboard
            cy.url().should('include', '/admin');

            // Should store user in localStorage
            cy.isAuthenticated();
        });
    });

    it('should show error message with invalid credentials', () => {
        cy.get('#email').type('invalid@example.com');
        cy.get('#password').type('wrongpassword');
        cy.get('button[type="submit"]').click();

        // Should display error message
        cy.get('[role="alert"]').should('be.visible').and('contain', 'Email ou senha inválidos');

        // Should stay on login page
        cy.url().should('include', '/login');
    });

    it('should require email field', () => {
        cy.get('#password').type('somepassword');
        cy.get('button[type="submit"]').click();

        // HTML5 validation should prevent submission
        cy.get('#email:invalid').should('exist');
    });

    it('should require password field', () => {
        cy.get('#email').type('admin@nova-acropole.org.br');
        cy.get('button[type="submit"]').click();

        // HTML5 validation should prevent submission
        cy.get('#password:invalid').should('exist');
    });

    it('should login with tutor credentials', () => {
        cy.fixture('users').then((users) => {
            cy.get('#email').type(users.tutor.email);
            cy.get('#password').type(users.tutor.password);
            cy.get('button[type="submit"]').click();

            cy.url().should('include', '/admin');
        });
    });
});
