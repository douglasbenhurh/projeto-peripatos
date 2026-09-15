describe('Obra Page', () => {
    beforeEach(() => {
        cy.visit('/obra?id=1');
    });

    it('should display the obra title', () => {
        cy.contains('O Pensador').should('be.visible');
    });

    it('should display the obra image', () => {
        cy.get('img[alt="O Pensador"]').should('exist');
    });

    it('should display the audio player', () => {
        cy.get('audio').should('exist');
    });

    it('should display the synchronized text component', () => {
        cy.contains('O Pensador (francês: Le Penseur)').should('be.visible');
    });

    it('should show error message when no obra ID is provided', () => {
        cy.visit('/obra');
        cy.contains('Nenhuma obra selecionada').should('be.visible');
    });

    it('should have play/pause controls in the audio player', () => {
        // Check for audio controls
        cy.get('audio').should('have.attr', 'controls');
    });
});
