import React, { useState } from "react";
import { Popover } from '@mui/material';

const TodoItem = ({ id, onRemove, isEditing, setIsEditing }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("At least one character is required");
  const [done, setDone] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    if (error) setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleText = (e) => {
    const newText = e.target.value;
    setText(newText);
    
    if (newText.length > 100) {
      setError("Task info should not exceed 100 characters");
    } else if (newText.length === 0) {
      setError("At least one character is required");
    } else {
      setError("");
    }
  };

  const handleDone = () => {
    setDone(!done);
  };

  const handleSave = () => {
    if (!error && text) {
      setIsEditing(id, false);
    }
  };

  const handleEdit = () => {
    setIsEditing(id, true);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4 w-full">
      <Popover
        id="mouse-over-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        className="pointer-events-none"
      >
        <p className="text-red-600 py-2 px-4">{error}</p>
      </Popover>

      {isEditing ? (
        <>
          <input
            placeholder="Add task info here"
            className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={text}
            onChange={handleText}
          />
          <div 
            className="flex w-full sm:w-auto gap-2 mt-2 sm:mt-0"
            aria-owns={open ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <button
              onClick={handleSave}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg ${
                !error ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "bg-gray-100 text-gray-700"
              }`}
              disabled={!!error || !text}
            >
              Save
            </button>
            <button
              onClick={() => onRemove(id)}
              className="flex-1 sm:flex-none px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <>
          <p className={`w-full sm:flex-1 break-words ${done ? 'text-gray-500 line-through' : ''}`}>
            {text}
          </p>
          <div className="flex w-full sm:w-auto gap-2 mt-2 sm:mt-0">
            <button
              onClick={handleEdit}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            >
              Edit
            </button>
            <button
              onClick={handleDone}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg ${
                done
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              {done ? "Undo" : "Done"}
            </button>
            <button
              onClick={() => onRemove(id)}
              className="flex-1 sm:flex-none px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [editingStates, setEditingStates] = useState({});

  const addTodo = () => {
    const newTodo = { id: Date.now() };
    setTodos([...todos, newTodo]);
    setEditingStates(prev => ({
      ...prev,
      [newTodo.id]: true
    }));
  };

  const removeTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    setEditingStates(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const setIsEditing = (id, isEditing) => {
    setEditingStates(prev => ({
      ...prev,
      [id]: isEditing
    }));
  };

  const hasEditingTodo = Object.values(editingStates).some(state => state);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Todo List</h1>
      <div className="space-y-4">
        {todos.map((todo) => (
          <TodoItem 
            key={todo.id} 
            id={todo.id} 
            onRemove={removeTodo}
            isEditing={editingStates[todo.id]}
            setIsEditing={setIsEditing}
          />
        ))}
      </div>
      {!hasEditingTodo && (
        <button
          onClick={addTodo}
          className="mt-4 sm:mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add New Task
        </button>
      )}
    </div>
  );
};

export default TodoList;