import React, { useState, FormEvent } from 'react';

interface Props {
  onAdd: (title: string) => Promise<void> | void;
  disabled?: boolean;
}

export const AddTodoForm: React.FC<Props> = ({ onAdd, disabled }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await onAdd(title.trim());
      setTitle('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    } finally {
      setSubmitting(false);
    }
  }

  return (
  <form onSubmit={handleSubmit} className="add-todo-form">
      <input
        type="text"
        placeholder="Add a todo..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={disabled || submitting}
        aria-label="New todo title"
      />
      <button type="submit" disabled={disabled || submitting || !title.trim()}>
        {submitting ? 'Adding...' : 'Add'}
      </button>
      {error && <span className="error-text">{error}</span>}
    </form>
  );
};
