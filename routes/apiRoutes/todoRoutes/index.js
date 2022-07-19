const router = require('express').Router();
const connection = require('../../../db/connection');

const isEven = function (number) {
    return new Promise((resolve, reject) => {
        if (number % 2 === 0) {
            resolve('isEven');
        } else {
            reject('isOdd');
        };
    });
};

// /api/todos
router.get('/', async (req, res) => {
    // Run as much code as we can inside the try block.
    // If any of it throws an error, immediately go into the catch block
    // with the specific error that happened and exit out of the try block.
    try {
        // You can only use await inside of a function.
        // The function that await is inside of has to have async declared before it.
        // Await will automatically call .then for isEven.
        // const result = await isEven(5);
        // res.json(result);

        const getAllTodos = 'SELECT * FROM todos;';
        const [todos] = await connection.query(getAllTodos);
        // Resultes in array with two elements: [ [rows], [dataWeDontCareAbout] ]
        res.json(todos);
    } catch (e) {
        console.log(e);
        res.json(e);
    }
});

router.post('/', async (res, req) => {
    // Pull todo from a form.
    const { todo } = req.body;

    if (todo.trim().length === 0) {
        return res.status(400).json({ error: 'Todo must be valid.' });
    }
    const insertTodoQuery = 'INSERT INTO todos (todo) VALUES(?);';
    const getTodoById = 'SELECT * FROM todos WHERE id = ? LIMIT 1;';

    try {
        const [queryResult] = await connection.query(insertTodoQuery, [todo]);
        // [ { howManyRowsWereInserted, insertId, }, null]
        const [todos] = await connection.query(getTodoById, [queryResult.insertId]);
        res.json(todos[0]);
    } catch (error) {
        res.status(500).json(error);
    }
});

/*
*
fetch(`/api/todos/${todoId}`, {
  method: 'DELETE',
}).then(res => res.json()
.then(deletedTodo => console.log(deletedTodo));
*
 */

router.delete('/:todoId', async (req, res) => {
    const { todoId } = req.params;
    const getTodoById = 'SELECT * FROM todos WHERE id = ?;';
    const deleteTodoById = 'DELETE FROM todos WHERE id = ?;';
    try {
        const [todos] = await connection.query(getTodoById, todoId);

        if (todos.length === 0) {
            return res.status(404).json({ error: 'Todo not found with that id.' });
        }
        await connection.query(deleteTodoById, todoId);
        res.json(todos[0]);
    } catch (error) {
        res.status(500).json({ error });
    }
});

/*
*
fetch(`/api/todos/${todoId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ todo: 'Run 3 miles'})
}).then(res => res.json()
.then(deletedTodo => console.log(deletedTodo));
*
 */

router.patch('/:todoId', async (req, res) => {
    const { todo } = req.body;
    const { todoId } = req.params;

    const getTodoById = 'SELECT * FROM todos WHERE id = ?;';
    if (todo.trim().length === 0) {
        return res.status(400).json({ error: 'Todo must be provided.' });
    }

    const updateToDoById = 'UPDATE todos SET todo = ? WHERE id = ?;';
    const [todos] = await connection.query(getTodoById, todoId);

    try {
        await connection.query(updateToDoById, [todo, todoId]);
        res.json(todos[0]);
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = router;