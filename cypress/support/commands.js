const url = 'https://conduit.productionready.io/api/users'

Cypress.Commands.add('createUser', () => {
    const username = 'test' + Math.random().toString().slice(2, 12)
    const email = `${username}@test.test`
    const user = {"username": username, "email": email, "password": "123Test!"}
    cy.log(username)
    cy.request('POST', url, {"user": user}).then(response => {
        expect(response.status).to.eq(200);
        return user;
    })
})