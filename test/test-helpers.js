const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
      {
        id: 1,
        user_name: 'test-user-1',
        first_name: 'Test',
        last_name: 'User1',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 2,
        user_name: 'test-user-2',
        first_name: 'Test',
        last_name: 'User2',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 3,
        user_name: 'test-user-3',
        first_name: 'Test',
        last_name: 'User3',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 4,
        user_name: 'test-user-4',
        first_name: 'Test',
        last_name: 'User4',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
    ]
  }

function makeReviewsArray(users) {
return [
    {
    id: 1,
    rating: 5,
    text: 'First test comment!',
    brewery_id: 6780,
    user_id: users[0].id,
    date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
    id: 2,
    rating: 5,
    text: 'Second test comment!',
    brewery_id: 6780,
    user_id: users[1].id,
    date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
    id: 3,
    rating: 5,
    text: 'Third test comment!',
    brewery_id: 6780,
    user_id: users[2].id,
    date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
    id: 4,
    rating: 5,
    text: 'Fourth test comment!',
    brewery_id: 6780,
    user_id: users[3].id,
    date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
    id: 5,
    rating: 5,
    text: 'Fifth test comment!',
    brewery_id: 6780,
    user_id: users[0].id,
    date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
    id: 6,
    rating: 5,
    text: 'Sixth test comment!',
    brewery_id: 6780,
    user_id: users[2].id,
    date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
    id: 7,
    rating: 5,
    text: 'Seventh test comment!',
    brewery_id: 6780,
    user_id: users[0].id,
    date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
];
}

function cleanTables(db) {
return db.transaction(trx =>
    trx.raw(
    `TRUNCATE
        brewbook_users,
        brewbook_reviews
    `
    )
    .then(() =>
    Promise.all([
        trx.raw(`ALTER SEQUENCE brewbook_reviews_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE brewbook_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('brewbook_reviews_id_seq', 0)`),
        trx.raw(`SELECT setval('brewbook_users_id_seq', 0)`),
    ])
    )
)
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
    }))
    return db
    .into('brewbook_users')
    .insert(preppedUsers)
    .then(() => 
    db.raw(
        `SELECT setval('brewbook_users_id_seq', ?)`,
        [users[users.length -1].id]
    )
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.user_name,
      algorithm: 'HS256'
    })
    return `Bearer ${token}`
  }

module.exports = {
    makeUsersArray,
    makeReviewsArray,
    cleanTables,
    seedUsers,
    makeAuthHeader
}