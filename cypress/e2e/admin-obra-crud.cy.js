describe('Admin Obra CRUD', () => {
    beforeEach(() => {
        cy.fixture('users').then((users) => {
            cy.login(users.admin.email, users.admin.password);
        });
    });

    describe('Create New Obra', () => {
        beforeEach(() => {
            cy.visit('/admin/nova-obra');
        });

        it('should display the new obra form', () => {
            cy.contains('Nova Obra').should('be.visible');
        });

        it('should have all required form fields', () => {
            cy.get('#titulo').should('be.visible');
            cy.get('#localizacao').should('be.visible');
            cy.get('#descricao').should('be.visible');
            cy.get('#texto').should('be.visible');
        });

        it('should have file upload inputs', () => {
            cy.get('#image-upload').should('exist');
            cy.get('#audio-upload').should('exist');
        });

        it('should have a cancel button', () => {
            cy.contains('button', 'Cancelar').should('be.visible');
        });

        it('should have a save button', () => {
            cy.contains('button', 'Salvar Obra').should('be.visible');
        });

        it('should navigate back to admin when clicking cancel', () => {
            cy.contains('button', 'Cancelar').click();
            cy.url().should('include', '/admin');
        });

        it('should require titulo field', () => {
            cy.get('button[type="submit"]').click();
            cy.get('#titulo:invalid').should('exist');
        });

        it('should create a new obra with valid data', () => {
            cy.get('#titulo').type('Nova Escultura');
            cy.get('#localizacao').type('Sala Principal');
            cy.get('#descricao').type('Uma bela escultura moderna');
            cy.get('#texto').type('Texto explicativo da obra...');

            cy.get('button[type="submit"]').click();

            // Should redirect to admin dashboard
            cy.url().should('include', '/admin');
        });
    });

    describe('Edit Existing Obra', () => {
        beforeEach(() => {
            cy.visit('/admin/editar/1');
        });

        it('should display the edit obra form', () => {
            cy.contains('Editar Obra').should('be.visible');
        });

        it('should pre-populate form with existing data', () => {
            cy.get('#titulo').should('have.value', 'O Pensador');
            cy.get('#localizacao').should('have.value', 'Jardim Central');
            cy.get('#descricao').should('contain.value', 'Auguste Rodin');
        });

        it('should allow editing the titulo', () => {
            cy.get('#titulo').clear().type('O Pensador - Editado');
            cy.get('#titulo').should('have.value', 'O Pensador - Editado');
        });

        it('should save edited obra', () => {
            cy.get('#titulo').clear().type('Título Atualizado');
            cy.get('button[type="submit"]').click();

            cy.url().should('include', '/admin');
        });
    });
});
