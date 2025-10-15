import React from 'react';
import { Todo } from '../types/todo';

interface Props {
  todo: Todo;
  onToggle: (todo: Todo) => void;
}

export const TodoItem: React.FC<Props> = ({ todo, onToggle }) => {
  return (
  <li>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo)}
        aria-label={`Toggle todo ${todo.title}`}
      />
      <span className={todo.done ? 'done' : undefined}>{todo.title}</span>
    </li>
  );
};
