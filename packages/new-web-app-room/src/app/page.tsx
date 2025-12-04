'use client';

import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const addTodo = () => {
    if (inputText.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputText.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputText('');
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim() !== '') {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
            My Todo App
          </h1>
          
          {/* Add Todo Input */}
          <div className="flex gap-3 mb-8">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={addTodo}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Add
            </button>
          </div>

          {/* Stats */}
          {totalCount > 0 && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {completedCount} of {totalCount} tasks completed
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Todo List */}
          <div className="space-y-3">
            {todos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No tasks yet. Add one above to get started!
                </p>
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                    todo.completed
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      todo.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-500 hover:border-green-500'
                    }`}
                  >
                    {todo.completed && '✓'}
                  </button>

                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={handleEditKeyPress}
                      onBlur={saveEdit}
                      autoFocus
                      className="flex-1 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    />
                  ) : (
                    <span
                      className={`flex-1 ${
                        todo.completed
                          ? 'line-through text-gray-500 dark:text-gray-400'
                          : 'text-gray-800 dark:text-white'
                      }`}
                    >
                      {todo.text}
                    </span>
                  )}

                  <div className="flex gap-2">
                    {editingId === todo.id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(todo.id, todo.text)}
                          className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Clear Completed Button */}
          {completedCount > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setTodos(todos.filter(todo => !todo.completed))}
                className="px-4 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Clear Completed ({completedCount})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

