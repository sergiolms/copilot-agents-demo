export interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: string; // ISO string from backend
  updatedAt: string; // ISO string from backend
}

export interface CreateTodoInput {
  title: string;
}
