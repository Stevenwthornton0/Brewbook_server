
# Brewbook (server)

This is the backend code for Brewbook, a search-based pseudo-social-media application that allows the user to search for, and review all breweries in a given city.

- [Live app](https://brewbook-app.now.sh/)
- [Link to client repo](https://github.com/Stevenwthornton0/Brewbook_client)

## API Documentation
### Reviews Endpoints

## **1. GET /reviews**

Returns an array of reviews on a brewery page that were submitted with an id number that corresponds with that brewery.

### Sample query

```
1. /reviews/:brewery_id
```

### Example response
```
[
    {
        "id": 2,
        "rating": 5,
        "text": "Great beer!",
        "brewery_id": 6780,
        "date_created": "2019-10-01T16:11:11.000Z",
        "user": {
            "id": 1,
            "user_name": "dunder",
            "first_name": "Dunder",
            "last_name": "Mifflin",
            "date_created": "2019-12-22T10:38:03.831Z",
            "date_modified": null
        }
    }
]
```
- ```id - string``` - uuid of review post
- ```rating - integer``` - the score, out of five, given by the user
- ```text-string``` - any additional review the user may leave
- ```brewery_id - integer``` - the uuid of the brewery that the review is associated with
- ```date_created - date``` - the date the review was created
- ```user - object``` - the user who posted the review 

## **2. POST /reviews/:brewery_id**

The application allows users to post their reviews of different breweries for others to read.

### Example request

```
{
    brewery_id: 6780,
    rating: 5,
    text: "Great Beer!",
    user: {
        id: 1,
        user_name: "dunder",
        first_name: "Dunder",
        last_name: "Mifflin",
        date_created: "2019-12-22T10:38:03.831Z",
        date_modified: null
    }

}
```

## **DELETE /reviews/:brewery_id/:review_id**

This endpoint allows the authorized admin to delete any reviews unwanted or innapropriate specified by the brewery_id and the id of the review itself. If no review id is found, the server responds with a status 400.

### Users Endpoints
## **GET /users/:user_name**

Returns the data for the user specified by the user_name.

If no user is found, server responds with a status 400.

### Example response
```
{
    "id": 1,
    "first_name": "Dunder",
    "last_name": "Mifflin",
    "user_name": "dunder",
    "admin": true,
    "date_created": "2019-12-22T10:38:03.831Z"
}
```

## **POST /users**

This endpoint allows users to register a new account to the server.

If not all parameters are followed, server responds with a status 400.

### Example request
```
{
    first_name: "dunder",
    last_name: "mifflin",
    user_name: "dunder",
    password: "password"
    date_created: "2019-12-22T10:38:03.831Z"
}
```

## Technology Stack
### Backend

- **Express** for handling API requests
- **Node** for interacting with the file system
- **Knex.js** for interfacing with the PostgresQL database
- **Postgrator** for database migration
- **Mocha, Chai, Supertest** for endpoints testing
- **JSON Web Token, bcryptjs** for user authentication / authorization