import loginPage from '../pages/login.obj'
import dashboard from '../pages/dashboard.obj'
import settingsPage from '../pages/settings.obj'

const picUrl = 'https://i.pravatar.cc/150'

function signIn(email, password) {
    cy.get(loginPage.emailField).type(email)
    cy.get(loginPage.passwordField).type(password)
    cy.get(loginPage.signInButton).click()
}

function generateUsername() {
    return 'test' + Math.random().toString().slice(2, 12)
}

describe('Settings Tests.', () => {
        beforeEach(() => {
            cy.visit('/login');
            cy.createUser().as('credentials').then((user) => {
                signIn(user.email, user.password)
                cy.get(dashboard.settingsLink).click()
            })
        })

        it('Verify that the user can set and remove the profile picture.', function () {
            cy.get(settingsPage.pictureUrlField).type(picUrl)
            cy.get(settingsPage.updateSettingsButton).click()
            cy.get(dashboard.picture).should('be.visible')
            cy.get(dashboard.settingsLink).click()
            cy.get(settingsPage.pictureUrlField).clear()
            cy.get(settingsPage.updateSettingsButton).click()
            cy.get(dashboard.picture).should('not.exist')
        })

        it('Verify that the user can update the username.', function () {
            const newUsername = generateUsername()

            cy.get(settingsPage.usernameField).clear().type(newUsername)
            cy.get(settingsPage.updateSettingsButton).click()
            cy.get(dashboard.username).should('be.visible').
                and('contain', newUsername)
        })

        it('Verify that the user can not remove the username.', function () {
            cy.get(settingsPage.usernameField).clear()
            cy.get(settingsPage.updateSettingsButton).click()
            cy.get(settingsPage.errorMessages).should('be.visible')
                .and('contain', 'username can\'t be blank')
                .and('contain', 'username is too short (minimum is 1 character)')
        })

        it('Verify that the user can not remove the username.', function () {
            cy.get(settingsPage.usernameField).type("123456789012345678901")
            cy.get(settingsPage.updateSettingsButton).click()
            cy.get(settingsPage.errorMessages).should('be.visible')
                .and('contain', 'username is too long (maximum is 20 characters)')
        })

        it('Verify that the user can not change the username to already existing username.', function () {
            cy.createUser().then((user) => {
                cy.get(settingsPage.usernameField).clear().type(user.username)
            })
            cy.get(settingsPage.updateSettingsButton).click()
            cy.get(settingsPage.errorMessages).should('be.visible')
                .and('contain', 'username has already been taken')
        })

        it('Verify that the user can update the bio.', function () {
            const userBio = 'user bio'

            cy.get(settingsPage.bioField).type(userBio)
            cy.get(settingsPage.updateSettingsButton).click()
            cy.get(dashboard.userBio).should('be.visible')
                .and('have.text', userBio)
        })

        it('Verify that the user can update the email with valid email.', function () {
            const newEmail = generateUsername() + '@test.test'

            cy.get(settingsPage.emailField).clear().type(newEmail)
            cy.get(settingsPage.updateSettingsButton).click()
            cy.get(dashboard.settingsLink).click()
            cy.get(settingsPage.logoutButton).click()
            cy.visit('/login')
            signIn(newEmail, this.credentials.password)
            cy.get(dashboard.username).should('be.visible').
                and('contain', this.credentials.username)
        })

        it('Verify that the user can not change the email to empty value.', function () {
            cy.get(settingsPage.emailField).clear()
            cy.get(settingsPage.updateSettingsButton).click()
            cy.get(settingsPage.errorMessages).should('be.visible')
                .and('contain', 'email can\'t be blank')
        })

        it('Verify that the user can not change the email to already existing email.', function () {
            cy.createUser().then((user) => {
                cy.get(settingsPage.emailField).clear().type(user.email)
            })
            cy.get(settingsPage.updateSettingsButton).click()
            cy.get(settingsPage.errorMessages).should('be.visible')
                .and('contain', 'email has already been taken')
        })

        it('Verify that the user can update the password with valid password.', function () {
            const newPassword = '456Test!'

            cy.get(settingsPage.newPasswordField).type(newPassword)
            cy.get(settingsPage.updateSettingsButton).click()
            cy.url().should('include', this.credentials.username);
            cy.get(dashboard.settingsLink).click()
            cy.get(settingsPage.logoutButton).click()
            cy.visit('/login')
            signIn(this.credentials.email, newPassword)
            cy.get(dashboard.username).should('be.visible').
                and('contain', this.credentials.username)
        })

        it('Verify that the user can not change the password to invalid value.', function () {
            cy.get(settingsPage.newPasswordField).type("456Test")
            cy.get(settingsPage.updateSettingsButton).click()
            cy.get(settingsPage.errorMessages).should('be.visible')
                .and('contain', 'password is too short (minimum is 8 characters)')
        })

})