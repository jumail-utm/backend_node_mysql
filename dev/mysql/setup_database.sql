-- Execute this command 'CREATE DATABASE' only on localhost development.
-- As production, the database will be created by heroku
CREATE DATABASE IF NOT EXISTS tododb;

DROP TABLE IF EXISTS todos;

CREATE TABLE IF NOT EXISTS todos(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255),
    completed INT DEFAULT 0,

    PRIMARY KEY (id)
);

INSERT INTO todos(title, completed) VALUES
    ('Prepare proposal for the new project', 1),
    ('Replace light bulb', 1),
    ('Buy Flutter eBook',0),
    ('Subscribe to Fibre optic internet service',0),
    ('Setup online meeting room', 1);