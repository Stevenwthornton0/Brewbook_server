BEGIN;

TRUNCATE
    brewbook_users,
    brewbook_reviews
    RESTART IDENTITY CASCADE;

INSERT INTO brewbook_users(user_name, first_name, last_name, password, admin)
VALUES
    ('dunder', 'Dunder', 'Mifflin', '$2y$12$fUEam31SC4TcI4FqXPXQPO3yxNo/MRwyz3AckckA3yl88/4vsPEA6', 'true'),
    ('mr_music', 'Alan', 'Menken', '$2y$12$r77Xk2ciZyAxgAu7.8BXeOhG4pce2pGyCLRmk.4yLatudodG4ALqC', 'false'),
    ('danger-zone', 'Johnny', 'Knoxville', '$2y$12$/.XZ9g2jLid66XnE97jpcurbcxYgRZpPhyIPZixkV2y7ZwQA/ubga', 'false'),
    ('bettyboop', 'Betty', 'Boop', '$2y$12$iBf6UToH0Gxt.J13yrJYNuoWq02UA4zx1jRwwjYtWlJP9QVOJuPoS', 'false'),
    ('roids4days', 'Alex', 'Rodriguez', '$2y$12$FXLLo5ReWWbVtlLxW.BWluSPPdP8dm1Fz2HcxzXxULxpUyPgfkyHu', 'false'),
    ('crocodileHunter', 'Steve', 'Irwin', '$2y$12$eImUH.840SXYNPEG9b4myuhRlaI.lzJ6.aL.cGuNXUpc06KqtA5um', 'false');

INSERT INTO brewbook_reviews(rating, text, date_created, brewery_id, user_id)
VALUES
    (4, 'Love it', '2019-03-26T15:14:13+00:00', 'jester-king-brewery-austin', 3),
    (5, 'Great beer!', '2019-10-01T11:11:11+00:00', 'jester-king-brewery-austin', 1),
    (1, 'Ghastly', '2019-04-22T12:01:30+00:00', 'jester-king-brewery-austin', 6),
    (2, 'I''ve seen better', '2019-01-01T23:59:20+00:00', 'jester-king-brewery-austin', 2),
    (5, 'Two thumbs up!', '2019-01-01T23:59:20+00:00', 'jester-king-brewery-austin', 4),
    (5, 'Pizza was dank dank dank', '2019-07-04T13:13:13+00:00', 'jester-king-brewery-austin', 3),
    (3, 'I could go either way', '2019-02-04T04:04:04+00:00', 'jester-king-brewery-austin', 5);

COMMIT;