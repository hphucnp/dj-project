import React, { useState, useEffect } from 'react';
import { todoService } from '../services/api';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await todoService.getAllTodos();
      setTodos(response.data.results || response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (todoData) => {
    try {
      await todoService.createTodo(todoData);
      fetchTodos();
    } catch (err) {
      setError('Failed to create todo');
      console.error(err);
    }
  };

  const handleUpdate = async (id, todoData) => {
    try {
      await todoService.updateTodo(id, todoData);
      fetchTodos();
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await todoService.deleteTodo(id);
      fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };

  const handleComplete = async (id) => {
    try {
      await todoService.completeTodo(id);
      fetchTodos();
    } catch (err) {
      setError('Failed to complete todo');
      console.error(err);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    return todo.status === filter;
  });

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="todo-list-container">
      <h1>Todo App</h1>

      {error && <div className="error">{error}</div>}

      <TodoForm onSubmit={handleCreate} />

      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={filter === 'in_progress' ? 'active' : ''}
          onClick={() => setFilter('in_progress')}
        >
          In Progress
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="todos">
        {filteredTodos.length === 0 ? (
          <p className="no-todos">No todos found</p>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onComplete={handleComplete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TodoList;
