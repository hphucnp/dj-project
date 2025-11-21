import React, { useState } from 'react';

function TodoItem({ todo, onUpdate, onDelete, onComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [status, setStatus] = useState(todo.status);

  const handleSave = () => {
    onUpdate(todo.id, { title, description, status });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(todo.title);
    setDescription(todo.description || '');
    setStatus(todo.status);
    setIsEditing(false);
  };

  const getStatusClass = () => {
    switch (todo.status) {
      case 'completed':
        return 'status-completed';
      case 'in_progress':
        return 'status-in-progress';
      default:
        return 'status-pending';
    }
  };

  if (isEditing) {
    return (
      <div className={`todo-item ${getStatusClass()}`}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="edit-input"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="edit-textarea"
          placeholder="Description"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <div className="todo-actions">
          <button onClick={handleSave} className="btn-save">Save</button>
          <button onClick={handleCancel} className="btn-cancel">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${getStatusClass()}`}>
      <div className="todo-content">
        <h3>{todo.title}</h3>
        {todo.description && <p>{todo.description}</p>}
        <div className="todo-meta">
          <span className="status-badge">{todo.status}</span>
          <span className="date">
            {new Date(todo.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="todo-actions">
        {todo.status !== 'completed' && (
          <button onClick={() => onComplete(todo.id)} className="btn-complete">
            Complete
          </button>
        )}
        <button onClick={() => setIsEditing(true)} className="btn-edit">
          Edit
        </button>
        <button onClick={() => onDelete(todo.id)} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
