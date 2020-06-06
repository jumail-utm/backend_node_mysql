const todosModel = require('../models/todos_model')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res, next) => {
    // Test the model
    const result = await todosModel.get()
    res.json(result)
})

router.get('/:id', async (req, res, next) => {
    const result = await todosModel.getById(req.params.id)
    res.json(result)
})

module.exports = router