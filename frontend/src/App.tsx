import React, { useEffect, useState, useCallback } from 'react';
import { fetchTodos, createTodo, toggleTodo } from './api/todoApi';
import { Todo } from './types/todo';
import { AddTodoForm } from './components/AddTodoForm';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchTodos();
        if (!cancelled) setTodos(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load todos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleAdd = useCallback(async (title: string) => {
    const optimistic: Todo = {
      id: `temp-${Date.now()}`,
      title,
      done: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTodos(prev => [optimistic, ...prev]);
    try {
      const created = await createTodo({ title });
      setTodos(prev => prev.map(t => t.id === optimistic.id ? created : t));
    } catch (err) {
      setTodos(prev => prev.filter(t => t.id !== optimistic.id));
      throw err;
    }
  }, []);

  const handleToggle = useCallback(async (todo: Todo) => {
    // optimistic update
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, done: !t.done } : t));
    try {
      const updated = await toggleTodo(todo);
      setTodos(prev => prev.map(t => t.id === todo.id ? updated : t));
    } catch (err) {
      // rollback
      setTodos(prev => prev.map(t => t.id === todo.id ? todo : t));
      setError(err instanceof Error ? err.message : 'Failed to toggle todo');
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      {/* Spider Web at Top */}
      <div className="spider-web">🕸️</div>
      
      {/* Dropping Spider */}
      <div className="spider-container">
        <div className="spider-line"></div>
        <div className="spider">🕷️</div>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
        <h1 className="text-5xl md:text-6xl font-spooky text-center mb-16 text-spooky-yellow animate-glow">
          🎃 Haunted TO DO list 🎃
        </h1>
        <div className="spooky-card max-w-2xl w-full p-8 pb-12 animate-float-slow">
          <AddTodoForm onAdd={handleAdd} />
          <div className="flex gap-3 mb-4">
            <button 
              onClick={handleRefresh} 
              disabled={refreshing || loading}
              className="spooky-button-secondary"
            >
              {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
            </button>
          </div>
          <TodoList todos={todos} onToggle={handleToggle} loading={loading} error={error} />
        </div>
      </div>
    </>
  );
};

export default App;
