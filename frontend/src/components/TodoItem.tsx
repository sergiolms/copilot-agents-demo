import React from 'react';
import { Todo } from '../types/todo';

interface Props {
  todo: Todo;
  onToggle: (todo: Todo) => void;
}

export const TodoItem: React.FC<Props> = ({ todo, onToggle }) => {
  return (
    <li className="todo-item group">
      <input
        type="checkbox"
        id={`toggle-${todo.id}`}
        checked={todo.done}
        onChange={() => onToggle(todo)}
        aria-labelledby={`toggle-${todo.id}`}
        className="todo-checkbox"
      />
      <label htmlFor={`toggle-${todo.id}`} className={`flex-1 text-ghost-white font-medium transition-all cursor-pointer ${
        todo.done 
          ? 'line-through text-gray-500 opacity-60' 
          : 'group-hover:text-spooky-yellow'
      }`}>
        {todo.done ? '💀' : '🦇'} {todo.title}
    </label>
    </li>
  );
};
