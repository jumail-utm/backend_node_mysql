# Deploy Node JS REST API Server on Heroku

## Prepare the node project for deployment to heroku

Comment out the part of code that loads mock environment variables in `./api/server.js` or in  `./api/database.js`

```javascript
// require('dotenv').config()  // Comment this when deploying to heroku
```

Issue the following commands in Git bash CLI

```bash
# Login to heroku (if you haven't already done)
$ heroku login

# Create an heroku app (if you haven't created one)
$ heroku create your-app-name

# Initialize a git repository (if you haven't done)
$ git init
```

## Deploy the Node Application

```bash
$ git add .
$ git commit -am 'Deploy to heroku'
$ git push heroku master
```

## Defining Environment Variables

[Get your database configurations](pages/../heroku-setup-mysql.html##Create-and-Manipulate-Database)

Set each environent variable accordingly, as follows:

```bash
$ heroku config:set DATABASE_HOST=us-cdbr-east-05.cleardb.net
$ heroku config:set DATABASE_USER=cq27fd50e67302
$ heroku config:set DATABASE_PASSWORD=d4d6f8g9
$ heroku config:set DATABASE_NAME=heroku_7d5414e20b2b749
$ heroku config:set DATABASE_CONNECTION_LIMIT=10
```

## Testing the API Server

Use REST Client on VSCode to test consuming the server

## Troubleshooting

If the server does not work, see the heroku log for the app

```bash
$ heroku logs --tail
```
