// ***********************************************
// Custom commands for Peripatos E2E tests
// ***********************************************

/**
 * Login command
 * @example cy.login('admin@nova-acropole.org.br', 'admin')
 */
Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login');
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/admin');
});

/**
 * Logout command
 * @example cy.logout()
 */
Cypress.Commands.add('logout', () => {
    cy.clearLocalStorage();
    cy.visit('/');
});

/**
 * Check if user is authenticated
 * @example cy.isAuthenticated()
 */
Cypress.Commands.add('isAuthenticated', () => {
    cy.window().then((win) => {
        const user = win.localStorage.getItem('user');
        expect(user).to.not.be.null;
    });
});
