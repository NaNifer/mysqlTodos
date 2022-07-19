/* GET localhost:3001/api/todos */
fetch('/api/todos')
  .then(res => res.json())
  .then(todos => console.log(todos));