ALTER TABLE items
ADD COLUMN user_name varchar DEFAULT 'Unknown' NOT NULL;

ALTER TABLE judgements
ADD COLUMN user_name varchar DEFAULT 'Unknown' NOT NULL;