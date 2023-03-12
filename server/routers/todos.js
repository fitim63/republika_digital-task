const {Router} = require('express');
const {TodoRecord} = require('../records/todo.record');
const {pool} = require('../utils/db');

const TodoRouter = Router();

TodoRouter.get('/todos', async (req, res) => {
    const todosList = await TodoRecord.listAll();
    res.send(todosList);
})
    .post('/create', async (req, res) => {

        const newTodo = new TodoRecord(req.body);
        await newTodo.insert();
        console.log('req', req.body)
        console.log('newTodo', newTodo)
        res.send(newTodo);
    })
    .delete('/delete/:id', async (req, res) => {
        const todo = await TodoRecord.getOne(req.params.id);
        if (todo) {
            await todo.delete();
            console.log('todo', todo)
            res.json(todo);
            return todo
        } else {
            console.log('error')
            res.status(404).send('Todo not found');
        }
    })
    .put('/update/:id', async (req, res) => {
        console.log('req.params.id', req.params.id)
        const todo = await TodoRecord.getOne(req.params.id);
        await todo.update(req.params.id, req.body.name, req.body.status);
    })
    .put('/updateStatus/:id', async (req, res) => {
        const todo = await TodoRecord.getOne(req.params.id);
        await todo.updateStatus(req.body.id, req.body.status)
        return res
    })
    .get('/getTodoById/:id', async (req, res) => {
        console.log('res', await TodoRecord.getOne(req.params.id))
        const todo = await TodoRecord.getOne(req.params.id);
        if (todo) {
            console.log('todo', todo)
            res.json(todo);
            return todo
        } else {
            console.log('error')
            res.status(404).send('Todo not found');
        }
    })

module.exports = {
    TodoRouter,
};