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
  if (loading) return <p className="text-center text-ghost-white text-lg">🕸️ Loading your spooky tasks...</p>;
  if (error) return <p className="text-center text-red-400 font-semibold">{error}</p>;
  if (!todos.length) return <p className="text-center text-gray-400 text-lg">👻 No tasks yet... add something spooky!</p>;
  return (
    <ul className="space-y-2">
      {todos.map(t => (
        <TodoItem key={t.id} todo={t} onToggle={onToggle} />
      ))}
    </ul>
  );
};
