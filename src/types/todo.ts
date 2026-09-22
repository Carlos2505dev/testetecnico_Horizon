export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type StatusFilter = 'all' | 'pending' | 'completed';

export interface TodoFilters {
  searchQuery: string;
  status: StatusFilter;
}

export interface CreateTodoPayload {
  title: string;
  completed?: boolean;
}

export interface UpdateTodoPayload {
  title?: string;
  completed?: boolean;
}

export interface FormValidationError {
  title?: string;
}
