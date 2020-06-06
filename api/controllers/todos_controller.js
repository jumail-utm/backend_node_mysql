const database = require('../database')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res, next) => {
    // Test database connection
    const result = await database.query('SELECT * FROM todos')
    res.json(result)
})

router.get('/:id', (req, res, next) => {
    const todoId = req.params.id
    res.json({ result: `Get the todo of id ${todoId}` })
})

module.exports = router