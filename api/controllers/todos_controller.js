const todosModel = require('../models/todos_model')
const express = require('express')
const router = express.Router()

// Get all todos
router.get('/', async (req, res, next) => {
    try {

        const result = await todosModel.get()
        res.json(result)
    }
    catch (e) {
        console.log(e)
    }
})

// Get one todo
router.get('/:id', async (req, res, next) => {
    try {
        const result = await todosModel.getById(req.params.id)
        if (!result) return res.sendStatus(404)
        res.json(result)
    }
    catch (e) {
        console.log(e)
    }
})

// Create a new todo
router.post('/', async (req, res, next) => {
    try {
        const createResult = await todosModel.create(req.body)
        if (!createResult.affectedRows) return res.sendStatus(409)

        const result = await todosModel.getById(createResult.insertId)
        res.status(201).json(result)
    }
    catch (e) {
        console.log(e)
    }
})

// Delete a todo
router.delete('/:id', async (req, res, next) => {
    try {
        const result = await todosModel.delete(req.params.id)
        if (!result.affectedRows) return res.sendStatus(404)
        res.sendStatus(200)
    }
    catch (e) {
        console.log(e)
    }
})

// Update a todo
router.patch('/:id', async (req, res, next) => {
    try {
        const updateResult = await todosModel.update(req.params.id, req.body)
        if (!updateResult.affectedRows) return res.sendStatus(404)

        const result = await todosModel.getById(req.params.id)
        res.json(result)
    }
    catch (e) {
        console.log(e)
    }
})


module.exports = router