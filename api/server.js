const port = 3000
const express = require('express')
const todosRouter = require('./controllers/todos_controller')

const app = express()

app.get('/', (req, res, next) => res.send(`Server is running on port ${port}`))
app.use('/todos', todosRouter)

app.listen(port, () => { console.log(`Server is running on port ${port}`) })
