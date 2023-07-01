const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('CONNECTION STRING HERE', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected Successfully'))
    .catch(err => console.log(err));

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const todoSchema = new mongoose.Schema({
    task: String,
}, {
    timestamps: true,
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/todos/', (req, res) => {
    Todo.find()
        .then(todos => {
            const modifiedTodos = todos.map(todo => {
                return {
                    _id: todo._id,
                    task: todo.task,
                    date: todo.createdAt.toISOString(),
                }
            });
            res.json(modifiedTodos);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

app.post('/todos/add', (req, res) => {
    const newTodo = new Todo({
        task: req.body.task,
    });

    newTodo.save()
        .then((todo) => {
            res.json({
                _id: todo._id,
                task: todo.task,
                date: todo.createdAt.toISOString(),
            });
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

app.post('/todos/update/:id', (req, res) => {
    Todo.findById(req.params.id)
        .then(todo => {
            todo.task = req.body.task;

            todo.save()
                .then(() => res.json('Todo updated.'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

app.delete('/todos/:id', (req, res) => {
    Todo.findByIdAndDelete(req.params.id)
        .then(() => res.json('Todo deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
