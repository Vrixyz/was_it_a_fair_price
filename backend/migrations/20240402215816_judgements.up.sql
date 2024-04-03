CREATE TABLE IF NOT EXISTS judgements (
    id SERIAL PRIMARY KEY NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- 0 too cheap ; 5 too expensive ; 3 perfect
    rating    INT NOT NULL,
    comment   VARCHAR NOT NULL,
    item_id   INT NOT NULL,
    -- id from Clerk
    user_id   VARCHAR NOT NULL,
    CONSTRAINT FK_item_id FOREIGN KEY(item_id)
        REFERENCES items(id)
        ON DELETE CASCADE
);
