import React from 'react';
import { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  onToggle: (todo: Todo) => void;
  loading?: boolean;
  error?: string | null;
}

export const TodoList: React.FC<Props> = ({ todos, onToggle, loading, error }) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!todos.length) return <p className="status-msg">No todos yet.</p>;
  return (
    <ul className="todo-list">
      {todos.map(t => (
        <TodoItem key={t.id} todo={t} onToggle={onToggle} />
      ))}
    </ul>
  );
};
