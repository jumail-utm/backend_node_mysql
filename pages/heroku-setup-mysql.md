# Setting Up MySQL Database on Heroku

## Create Heroku Apps

```bash
# Login to heroku
$ heroku login

# Create an app
$ heroku create your-app-name
```

## Create and Manipulate Database

```bash
# Add ClearDB MySQL (Ignite is a free plan)
$ heroku addons:create cleardb:ignite

# Retrieve your database URL
$ heroku config | grep CLEARDB_DATABASE_URL

```

Split the url to its host, username, passowrd,
e.g.

_format_:

CLEARDB_DATABASE_URL: mysql://**[username]**:**[password]**@**[host]**/**[database name]**?reconnect=true

_example_:

CLEARDB_DATABASE_URL: mysql://**cq27fd50e67302**:**d4d6f8g9**@**us-cdbr-east-05.cleardb.net**/**heroku_7d5414e20b2b749**?reconnect=true

- **username:** cq27fd50e67302
- **password:** d4d6f8g9
- **host :** us-cdbr-east-05.cleardb.net
- **database:** heroku_7d5414e20b2b749

## Create Tables and Insert Data

- Use any SQL Client to access to your database. I will be using `MySQL Admin`
- Specify the database connection on your client: Host, username and password
- Create table and insert data by running SQL script on the editor

```sql
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
```
