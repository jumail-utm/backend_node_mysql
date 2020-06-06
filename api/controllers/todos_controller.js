const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.json(
        {
            result: 'Get all todos'
        }
    )
})

router.get('/:id', (req, res, next) => {
    const todoId = req.params.id
    res.json({ result: `Get the todo of id ${todoId}` })
})

module.exports = router