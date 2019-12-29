const express = require('express');
const path = require('path');
const ReviewsService = require('./reviews-service');
const { requireAuth } = require('../middleware/jwt-auth');

const reviewsRouter = express.Router();
const jsonBodyParser = express.json();

reviewsRouter
    .route('/')
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { brewery_id, rating, text } = req.body;
        const newReview = { brewery_id, rating, text };

        for (const [key, value] of Object.entries(newReview))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })

        newReview.user_id = req.user.id

        ReviewsService.insertReview(
            req.app.get('db'),
            newReview
        )
            .then(review => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${review.id}`))
                    .json(ReviewsService.serializeReview(review))
            })
            .catch(next)
    })

reviewsRouter
    .route('/:brewery_id')
    .all(requireAuth)
    .get((req, res, next) => {
            ReviewsService.getBreweryReviews(
            req.app.get('db'),
            req.params.brewery_id
        )
            .then(reviews => {
                res.json(reviews.map(ReviewsService.serializeReview))
            })
            .catch(next)
    })

reviewsRouter
    .route('/:brewery_id/:review_id')
    // .all(requireAuth)
    .delete((req, res, next) => {
        ReviewsService.deleteReview(
            req.app.get('db'),
            req.params.brewery_id,
            req.params.review_id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)


    })

module.exports = reviewsRouter;