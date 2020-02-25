const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe(`users endpoints`, function() {
    let db

    before(`make knex instance`, () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after(`disconnect from db`, () => db.destroy())

    before(`cleanup`, () => helpers.cleanTables(db))

    afterEach(`cleanup`, () => helpers.cleanTables(db))

    describe(`POST /users`, () => {
        context('Happy Path', () => {
            it(`responds 201, serialized user, storing bcrypted password`, () => {
                const newUser = {
                    user_name: 'test user_name',
                    password: '11AAbb!!',
                    first_name: 'test',
                    last_name: 'test_name'
                }
                return supertest(app)
                    .post('/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.user_name).to.eql(newUser.user_name)
                        expect(res.body.first_name).to.eql(newUser.first_name)
                        expect(res.body.last_name).to.eql(newUser.last_name)
                        expect(res.body).to.not.have.property('password')
                        expect(res.headers.location).to.eql(`/users/${res.body.id}`)
                        const expectedDate = new Date().toLocaleString('en-US', { timeZone: 'UTC'})
                        const actualDate = new Date(res.body.date_created).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
                    .expect(res => 
                        db
                            .from('brewbook_users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.user_name).to.eql(newUser.user_name)
                                expect(row.first_name).to.eql(newUser.first_name)
                                expect(row.last_name).to.eql(newUser.last_name)
                                const expectedDate = new Date().toLocaleString('en-US', { timeZone: 'UTC' })
                                const actualDate = new Date(row.date_created).toLocaleString()
                                expect(actualDate).to.eql(expectedDate)

                                return bcrypt.compare(newUser.password, row.password)
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true
                            })
                    )
            })
        })
    })
})