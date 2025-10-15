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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter a spooky task... 👻"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={disabled || submitting}
          aria-label="New todo title"
          className="spooky-input flex-1"
        />
        <button type="submit" disabled={disabled || submitting || !title.trim()} className="spooky-button">
          {submitting ? '⏳ Adding...' : '✨ Add Task'}
        </button>
      </div>
      {error && <span className="text-red-400 text-sm font-semibold">{error}</span>}
    </form>
  );
};
