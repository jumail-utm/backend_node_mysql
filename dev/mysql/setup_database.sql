-- Execute this command 'CREATE DATABASE' only on localhost development.
-- As production, the database will be created by heroku
CREATE DATABASE IF NOT EXISTS tododb;

DROP TABLE IF EXISTS todos;

CREATE TABLE IF NOT EXISTS todos(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255),
    completed BOOLEAN DEFAULT false,

    PRIMARY KEY (id)
)

INSERT INTO todos(title, completed) VALUES
    ('Prepare proposal for the new project', true),
    ('Replace light bulb', true),
    ('Buy Flutter eBook',false),
    ('Subscribe to Fibre optic internet service',false),
    ('Setup online meeting room', true)