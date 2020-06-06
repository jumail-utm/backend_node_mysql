require('dotenv').config()  // Uncomment this when deploying to heroku

const mysql = require('mysql')

// Create database connection between nodejs and mysql
// Here, we are implementing the Database class with Singleton design pattern
//  Singleton is a design pattern where we create only a single instance (or object) from a class

class Database {

    constructor() {

        if (this.instance) return this.instance  // This is the key idea of implementing singleton. Return the same instance (i.e. the one that has already been created before)

        // We only proceedd to the following lines only if no instance has been created from this class
        Database.instance = this

        // We use Environment variables to configure the db connection, so that later when we deploy to heroku
        //  we can configure the database based on heroku configuration

        this.pool = mysql.createPool(
            {
                connectionLimit: process.env.DATABASE_CONNECTION_LIMIT,
                host: process.env.DATABASE_HOST,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME
            }
        )

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
                if (err) return reject(err)
                return resolve(result)
            })
        })
    }
}

module.exports = new Database()
