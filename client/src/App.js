import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/todos/')
      .then(response => setTodos(response.data))
      .catch((error) => console.log(error));
  }, []);

  const onChangeTask = (e) => setTask(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();

    const todo = {
      task: task,
    }

    axios.post('http://localhost:5000/todos/add', todo)
      .then(res => {
        setTodos([...todos, {
          _id: res.data._id,
          task: todo.task,
          date: new Date().toISOString()
        }])
        console.log(res.data);
      });

    setTask('');
  }

  const deleteTodo = (id) => {
    axios.delete('http://localhost:5000/todos/' + id)
      .then(res => console.log(res.data));
    setTodos(todos.filter(el => el._id !== id));
  }

  const editTodo = (id) => {
    setEditId(id);
    setIsEditing(true);
    const todoToEdit = todos.find((todo) => todo._id === id);
    setTask(todoToEdit.task);
  };

  const updateTodo = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/todos/update/" + editId, {
        task: task,
      })
      .then((res) => {
        console.log(res.data);
        setIsEditing(false);
        setTask("");
        setEditId(null);
        // refresh the todos list
        axios.get('http://localhost:5000/todos/')
          .then(response => setTodos(response.data))
          .catch((error) => console.log(error));
      });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }



  return (
    <div className="App">
      <h3>Create New Task</h3>
      <form onSubmit={onSubmit}>
        <input type="text" required value={task} onChange={onChangeTask} />
        <input type="submit" value="Add Task" />
      </form>

      {todos.map((todo) => (
        <div className="todo-item" key={todo._id}>
          <div>
            {editId === todo._id && isEditing ? (
              <input
                type="text"
                value={task}
                onChange={onChangeTask}
              />
            ) : (
              <span>{todo.task}</span>
            )}
            <p>{formatDate(todo.createdAt)}</p>
          </div>
          {editId === todo._id && isEditing ? (
            <button onClick={updateTodo}>Update Task</button>
          ) : (
            <button onClick={() => editTodo(todo._id)}>Edit</button>
          )}
          <button onClick={() => deleteTodo(todo._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
