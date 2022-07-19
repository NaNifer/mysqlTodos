const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();


/* middleware */
/* Create a route for every single file in this folder that we specify to this middleware */
/* A middleware is a function that will be called before or/and after a route handler/controller gets called
*
* */
app.use(express.static('public'));


// App.use is for declaring middlewares and what routes should they be applied to
// app.use takes 1 or 2  parameters by default.
// if the 1st parameter is not a string, it is expecting a function
// if it's a string, it will apply the function on every route that matches that string
// by default if you do not pass a string, it will apply it to '/'
// under the hood middleware functions should either respond to the user
// or call next to get to the next function


/*
Middleware to grab the data that's coming in from the form
 and attach it to a property named 'body' on the request object
*
* */
/*
* What body parser does is it will take the data that's coming in from the POST/DELETE/PATCH/PUT request
* and attach each property and its value to the req.body object
* */
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// You can only have 1 server running per PORT
/*
* MONGO DB:  27017
* REDIS : 6307
*
* */
const PORT = process.env.PORT || 3001;
// const todos = [
//   {
//     id: 1,
//     todo: 'Take another covid test',
//   },
//   {
//     id: 2,
//     todo: 'Update resume'
//   },
//   {
//     id: 3,
//     todo: 'Practice playing the piano',
//   },
//   {
//     id: 4,
//     todo: 'Play cuphead',
//   },
// ];
//

/*
* 2 different kinds of routes
*
* 1st kind will be routes that sends html only
*
*
* 2nd kind will be routes that only sends json from data that's coming from our database
* */
/**/


/* Every route that sends json data will have /api/todos at the very beginning no matter what?*/

/* if it's a route that just sends HTML, it's normally just /nameOfHTMLFile */


// app.get('/', (req, res) => {
//   console.log(__dirname);
//   /* __dirname/public/index.html
//   */
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
//  1st parameter = Request object
//  this contains information about the incoming request
//  2nd parameter = Response object
// this contains functions for responding to the specific request


app.get('/todos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'todos.html'));
});


// localhost:3001/api/todos
app.get('/api/todos', (req, res) => {
  /*  localhost:3001/api/todos   */
  // perform some database operation
  // respond with the database response


  fs.readFile(path.join(__dirname, 'db', 'todos.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(400).json({err});
    }
    // console.log(data);
    res.json(JSON.parse(data));
  });
});

/* If we dont respond to a request, the server just hangs */
/* For some platforms that we host apps on, like Heroku, Heroku
*  has a 30 seconds response time limit for your API's
* */
app.post('/api/todos', (req, res) => {
  const {todo} = req.body;
  if (todo.trim().length > 0) {
    fs.readFile(path.join(__dirname, 'db', 'todos.json'), 'utf8', (err, data) => {
      if (err) {
        return res.status(400).json({err});
      }

      const todos = JSON.parse(data);
      const newTodo = {
        todo,
        id: todos.length + 1,
      };
      todos.push(newTodo);
      fs.writeFile(path.join(__dirname, 'db', 'todos.json'), JSON.stringify(todos), err => {
        if (err) {
          return res.status(400).json({err});
        }
        res.json(newTodo);
      })
    });


  } else {
    res.status(400).json({error: 'Todo must be provided'});
  }

});


/* Analyze it and store it in the database and then respond back with it*/
app.get('/api/me', (req, res) => {
  res.json({
    firstName: 'Manny',
    powerLevel: 9001,
  });
});


/*  GET POST PUT/PATCH DELETE    */


/* When we use node command to run our server
* by default node will only use the original code that was written when we used it to run the file
* */
app.listen(PORT, () => console.log(`Server successfully listening for request on PORT ${PORT}`));