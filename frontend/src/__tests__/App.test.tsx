/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Simple in-memory mock data
let todos = [
  { id: '1', title: 'First', done: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

// Mock fetch
beforeEach(() => {
  todos = [
    { id: '1', title: 'First', done: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];
  (globalThis as any).fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.endsWith('/api/todos') && (!init || init.method === 'GET')) {
      return new Response(JSON.stringify(todos), { status: 200 });
    }
    if (url.endsWith('/api/todos') && init?.method === 'POST') {
      const body = JSON.parse(init.body as string);
      const created = { id: String(Date.now()), title: body.title, done: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      todos.unshift(created);
      return new Response(JSON.stringify(created), { status: 201 });
    }
    const matchToggle = url.match(/\/api\/todos\/(.+)$/);
    if (matchToggle && init?.method === 'PUT') {
      const id = matchToggle[1];
      const body = JSON.parse(init.body as string);
      const idx = todos.findIndex(t => t.id === id);
      if (idx === -1) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
      todos[idx] = { ...todos[idx], ...body, updatedAt: new Date().toISOString() };
      return new Response(JSON.stringify(todos[idx]), { status: 200 });
    }
    return new Response('Not found', { status: 404 });
  }) as any;
});

describe('App', () => {
  it('renders initial todos', async () => {
    render(<App />);
    expect(await screen.findByText('First')).toBeInTheDocument();
  });

  it('adds a todo', async () => {
    render(<App />);
  const inputs = await screen.findAllByLabelText('New todo title');
  const input = inputs[0];
    fireEvent.change(input, { target: { value: 'Second' } });
  const addButtons = screen.getAllByText('Add');
  fireEvent.click(addButtons[0]);
    await waitFor(() => expect(screen.getByText('Second')).toBeInTheDocument());
  });

  it('toggles a todo', async () => {
    render(<App />);
  const checkboxes = await screen.findAllByRole('checkbox');
  const checkbox = checkboxes[0];
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    await waitFor(() => expect(checkbox).toBeChecked());
  });
});
