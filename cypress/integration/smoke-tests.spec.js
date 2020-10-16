describe('Smoke tests', () => {
  beforeEach(() => {
    // DB will be empty for each test
    cy.request('GET', '/api/todos')
      .its('body')
      .each((todo) => cy.request('DELETE', `/api/todos/${todo.id}`));
  });
  context('With no todos', () => {
    it.only('Saves new todos', () => {
      const items = [
        { text: 'Buy milk', expectedLength: 1 },
        { text: 'Buy eggs', expectedLength: 2 },
        { text: 'Buy bread', expectedLength: 3 },
      ];
      cy.visit('/');
      cy.server();
      cy.route('POST', '/api/todos').as('create');

      cy.wrap(items).each((todo) => {
        cy.focused().type(todo.text).type('{enter}');

        cy.wait('@create'); // wait for POST to complete

        cy.get('.todo-list li').should('have.length', todo.expectedLength);
      });
    });
  });
});
