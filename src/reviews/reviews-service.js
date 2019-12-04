const xss = require('xss');

const ReviewsService = {
  getBreweryReviews(db, id) {
    return db
      .from('brewbook_reviews AS rev')
      .select(
        'rev.id',
        'rev.rating',
        'rev.text',
        'rev.date_created',
        'rev.brewery_id',
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  usr.id,
                  usr.user_name,
                  usr.first_name,
                  usr.last_name,
                  usr.date_created,
                  usr.date_modified
              ) tmp)
            )
          ) AS "user"`
        )
      )
      .where('rev.brewery_id', id)
      .leftJoin(
        'brewbook_users AS usr',
        'rev.user_id',
        'usr.id',
      )
      .groupBy('rev.id', 'usr.id')
  },

  insertReview(db, newReview) {
    return db
      .insert(newReview)
      .into('brewbook_reviews')
      .returning('*')
      .then(([review]) => review)
      .then(review =>
        ReviewsService.getById(db, review.id)
      )
  },

  serializeReview(review) {
    const { user } = review
    return {
      id: review.id,
      rating: review.rating,
      text: xss(review.text),
      brewery_id: review.brewery_id,
      date_created: new Date(review.date_created),
      user: {
        id: user.id,
        user_name: user.user_name,
        first_name: user.first_name,
        last_name: user.last_name,
        date_created: new Date(user.date_created),
        date_modified: new Date(user.date_modified) || null
      },
    }
  }
}

module.exports = ReviewsService
