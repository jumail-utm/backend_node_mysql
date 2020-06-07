# Writing Code for REST API Service with Node JS

## Setup Node Project

Open a git bash terminal and issue the following commands

```bash
# Create a new folder for the project
$ mkdir rest_node_mysql
$ cd rest_node_mysql

# Initialize this folder for Git
$ git init

# Create some new files (to be edited later in vscode)
$ touch .gitignore
$ touch .env

# Create a new Node project
$ npm init -y

# Install node packages
$ npm i express mysql
$ npm i nodemon dotenv --save-dev

# Open the project into vscode
$ code .
```

Edit the file `package.json` in VSCode

```javascript
{
  "name": "backend_node_msyql",
  "version": "1.0.0",
  "description": "",
  "main": "api/server.js",
  "scripts": {
    "development": "nodemon api/server.js",
    "start": "node api/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1",
    "mysql": "^2.18.1"
  },
  "devDependencies": {
    "dotenv": "^8.2.0",
    "nodemon": "^2.0.4"
  }
}
```

Edit the file `.ignore` in VSCode

```bash
node_modules/
.env
```

Create some folders and files from VSCode or by bash command line as follows

```bash
$ mkdir dev
$ mkdir dev/rest_client
$ touch dev/rest_client/request.rest

$ mkdir api
$ mkdir api/controllers
$ mkdir api/models
$ touch api/server.js
$ touch api/database.js
$ touch api/controllers/todos_controller.js
$ touch api/models/todos_model.js
```

## Define the main program

Complete version of file **`./api/server.js`**

```javascript
const port = process.env.PORT || 3000;
const express = require("express");
const todosRouter = require("./controllers/todos_controller");

const app = express();

app.use(express.json());

app.get("/", (req, res, next) => res.send(`Server is running on port ${port}`));
app.use("/todos", todosRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

## Setup Database Connection

Example content of the file **`.env`**. These will be the mock environment variables, used only during development. In production mode, they will be provided directly by the platform where this application runs on

```bash
# The port numberthe server listens to
PORT = 3000

# Configuration for Localhost database
DATABASE_HOST = localhost
DATABASE_USER = root
DATABASE_PASSWORD =
DATABASE_NAME = tododb
DATABASE_CONNECTION_LIMIT = 10

# Configuration for live database on heroku
# DATABASE_HOST=us-cdbr-east-05.cleardb.net
# DATABASE_USER=cq27fd50e67302
# DATABASE_PASSWORD=d4d6f8g9
# DATABASE_NAME=heroku_7d5414e20b2b749
# DATABASE_CONNECTION_LIMIT=10
```

Complete version of file **`./api/database.js`**

```javascript
require("dotenv").config(); // Uncomment this when deploying to heroku

const mysql = require("mysql");

// Create database connection between nodejs and mysql
// Here, we are implementing the Database class with Singleton design pattern
//  Singleton is a design pattern where we create only a single instance (or object) from a class

class Database {
  constructor() {
    if (this.instance) return this.instance; // This is the key idea of implementing singleton. Return the same instance (i.e. the one that has already been created before)

    // We only proceedd to the following lines only if no instance has been created from this class
    Database.instance = this;

    // We use Environment variables to configure the db connection, so that later when we deploy to heroku
    //  we can configure the database based on heroku configuration

    this.pool = mysql.createPool({
      connectionLimit: process.env.DATABASE_CONNECTION_LIMIT || 10,
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });
  }

  // This method is only a convinience wrapper. It is intended to convert Callback-based style to Promise-based style
  //  to acheive non-blocking code (or asynchronous code)
  //
  // Side node:  Asynchronous or Non-blocking programming can be done with Callback style or Promise based style
  //             mysql library is written based on Callback style. However, asynchronous programming is much easier
  //             done with Promise based as later you can use the async / await sytax

  query(sql, params) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, params, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  }
}

module.exports = new Database();
```

## Define Model Classes

Complete version of file **`./api/models/todos_model.js`**

```javascript
const database = require("../database");

// Here, we are implementing the class with Singleton design pattern
//  Singleton is a design pattern where we create only a single instance (or object) from a class

class TodoModel {
  constructor() {
    if (this.instance) return this.instance; // This is the key idea of implementing singleton. Return the same instance (i.e. the one that has already been created before)
    // We only proceedd to the following lines only if no instance has been created from this class
    TodoModel.instance = this;
  }

  get() {
    return database.query("SELECT * FROM todos");
  }

  async getById(id) {
    const rows = await database.query("SELECT * FROM todos WHERE id = ?", [id]);
    return rows[0];
  }

  create(todo) {
    return database.query(
      "INSERT INTO todos (title, completed) VALUES (?, ?)",
      [todo.title, todo.completed]
    );
  }

  delete(id) {
    return database.query("DELETE FROM todos WHERE id = ? ", [id]);
  }

  update(id, todo) {
    const fields = [];
    const params = [];

    for (const attribute in todo) {
      fields.push("?? = ?");
      params.push(attribute, todo[attribute]);
    }

    const stmt = `UPDATE todos SET ${fields.join(", ")} WHERE id = ?`;
    return database.query(stmt, [...params, parseInt(id)]);
  }
}

module.exports = new TodoModel();
```

## Define Routers

Complete version of file `./api/controllers/todos_controller.js`

```javascript
const todosModel = require("../models/todos_model");
const express = require("express");
const router = express.Router();

// Get all todos
router.get("/", async (req, res, next) => {
  try {
    const result = await todosModel.get();
    res.json(result);
  } catch (e) {
    console.log(e);
  }
});

// Get one todo
router.get("/:id", async (req, res, next) => {
  try {
    const result = await todosModel.getById(req.params.id);
    if (!result) return res.sendStatus(404);
    res.json(result);
  } catch (e) {
    console.log(e);
  }
});

// Create a new todo
router.post("/", async (req, res, next) => {
  try {
    const createResult = await todosModel.create(req.body);
    if (!createResult.affectedRows) return res.sendStatus(409);

    const result = await todosModel.getById(createResult.insertId);
    res.status(201).json(result);
  } catch (e) {
    console.log(e);
  }
});

// Delete a todo
router.delete("/:id", async (req, res, next) => {
  try {
    const result = await todosModel.delete(req.params.id);
    if (!result.affectedRows) return res.sendStatus(404);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
  }
});

// Update a todo
router.patch("/:id", async (req, res, next) => {
  try {
    const updateResult = await todosModel.update(req.params.id, req.body);
    if (!updateResult.affectedRows) return res.sendStatus(404);

    const result = await todosModel.getById(req.params.id);
    res.json(result);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
```

## Testing the REST API server

Use REST Client to test the API server

Edit the file file `./dev/rest_client/request.rest`

```bash
@baseUrl = http://localhost:3000

### Getting the list of todos
GET {{baseUrl}}/todos

###  Getting a todo of given id
GET {{baseUrl}}/todos/31

###  Create a new todo
POST {{baseUrl}}/todos
Content-Type: application/json

{
    "title": "New todo 3",
    "completed" : false
}

### Update the status of a given todo (whether is completed or not)
PATCH {{baseUrl}}/todos/21
Content-Type: application/json

{
    "completed": false
}

### Deleting a given todo
DELETE {{baseUrl}}/todos/21

```
