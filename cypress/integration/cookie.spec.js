/// <reference types="cypress" />

context('Cookie', () => {
  beforeEach(() => {
    Cypress.Cookies.debug(true)

    cy.visit('/todo')

    cy.clearCookies()
  })

  it('session cookie should be secured', () => {
    cy.getCookies().should('be.empty')

    cy.findByLabelText(/list name/i).type('new list')
    cy.findByDisplayValue('new list')
    cy.get('form').submit()

    cy.getCookies()
      .should('have.length', 1)
      .should(cookies => {
        expect(cookies[0]).to.have.property('name', 'NEMO-Todo')
        expect(cookies[0]).to.have.property('httpOnly', true)
        expect(cookies[0]).to.have.property('secure', true)
        expect(cookies[0]).to.have.property('domain')
        expect(cookies[0]).to.have.property('path')
      })
  })
})
