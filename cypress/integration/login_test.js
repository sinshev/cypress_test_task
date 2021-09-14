import loginPage from '../pages/login.obj'
import dashboard from '../pages/dashboard.obj'

describe('Login Tests.', () => {
        beforeEach(() => {
            cy.visit('/login')
        })

        it('Verify that the error message is displayed on attempt to login when username and password fields are empty.', function () {
            cy.get(loginPage.signInButton).click()
            cy.get(loginPage.errorMessages).should('be.visible')
                .and('contain', 'email or password is invalid')
        })

        it('Verify that the error message is displayed on attempt to login when username field is empty.', function () {
            cy.get(loginPage.emailField).type('test@test.test')
            cy.get(loginPage.signInButton).click()
            cy.get(loginPage.errorMessages).should('be.visible')
                .and('contain', 'email or password is invalid')
        })

        it('Verify that the error message is displayed on attempt to login when password field is empty.', function () {
            cy.get(loginPage.passwordField).type('123Test')
            cy.get(loginPage.signInButton).click()
            cy.get(loginPage.errorMessages).should('be.visible')
                .and('contain', 'email or password is invalid')
        })

        it('Verify that the error message is displayed on attempt to login with incorrect credentials.', function () {
            cy.get(loginPage.emailField).type('test@test.test')
            cy.get(loginPage.passwordField).type('123Test')
            cy.get(loginPage.signInButton).click()
            cy.get(loginPage.errorMessages).should('be.visible')
                .and('contain', 'email or password is invalid')
        })

        it('Verify that the user can login with valid credentials.', function () {
            cy.createUser().then((user) => {
                cy.get(loginPage.emailField).type(user.email)
                cy.get(loginPage.passwordField).type(user.password)
                cy.get(loginPage.signInButton).click()
                cy.get(dashboard.username).should('be.visible').
                and('contain', user.username)
            })
        })
})