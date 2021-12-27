/// <reference types="cypress" />

context('Todo', () => {
  beforeEach(() => {
    cy.visit('/todo')

    cy.clearCookies()
  })

  it('should redirect from /todo to /todo/new ', () => {
    cy.findAllByText(/create list/i).should('be.visible')

    cy.url().should('include', 'todo/new')
  })

  it('should create a list', () => {
    cy.findByLabelText(/list name/i).type('new list')
    cy.findByDisplayValue('new list')
    cy.get('form').submit()

    cy.findAllByText(/todo/i).should('have.length.at.least', 2)
  })

  it('check the hidden text on icons', () => {
    cy.findByLabelText(/list name/i).type('new list')
    cy.get('form').submit()

    // ? Check the Hidden Text on the Icons
    cy.findAllByRole('button', {type: 'button'})
      .should('have.length.at.least', 2)
      .contains(/add reminder/i)

    cy.findAllByRole('button', {type: 'button'})
      .should('have.length.at.least', 2)
      .contains(/view notes/i)
  })
})
