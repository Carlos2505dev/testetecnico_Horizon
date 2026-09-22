import { CreateTodoPayload, Todo, UpdateTodoPayload } from '../types/todo';
import { request } from './api';

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    return request<Todo[]>('/todos');
  },

  async getTodoById(id: number): Promise<Todo> {
    return request<Todo>(`/todos/${id}`);
  },

  async createTodo(payload: CreateTodoPayload): Promise<Todo> {
    return request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify({
        userId: 1,
        completed: false,
        ...payload,
      }),
    });
  },

  async updateTodo(id: number, payload: UpdateTodoPayload): Promise<Todo> {
    return request<Todo>(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async deleteTodo(id: number): Promise<void> {
    await request<unknown>(`/todos/${id}`, {
      method: 'DELETE',
    });
  },
};
