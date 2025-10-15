import { Todo, CreateTodoInput } from '../types/todo';

const API_BASE = 'http://localhost:3000/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch (_) {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(`${API_BASE}/todos`);
  return handleResponse<Todo[]>(res);
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const res = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  return handleResponse<Todo>(res);
}

export async function toggleTodo(todo: Todo): Promise<Todo> {
  const res = await fetch(`${API_BASE}/todos/${todo.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done: !todo.done })
  });
  return handleResponse<Todo>(res);
}

export async function updateTodoTitle(id: string, title: string): Promise<Todo> {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  return handleResponse<Todo>(res);
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to delete todo (${res.status})`);
  }
}
