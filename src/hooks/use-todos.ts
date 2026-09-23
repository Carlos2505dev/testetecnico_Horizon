import { useCallback, useEffect, useMemo, useState } from 'react';
import { todoService } from '../services/todo-service';
import { todoStorage } from '../storage/todo-storage';
import {
  CreateTodoPayload,
  StatusFilter,
  Todo,
  TodoFilters,
  UpdateTodoPayload,
} from '../types/todo';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [filters, setFilters] = useState<TodoFilters>({
    searchQuery: '',
    status: 'all',
  });

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);

    const cachedData = await todoStorage.getStoredTodos();
    if (cachedData && cachedData.length > 0) {
      setTodos(cachedData);
      setLoading(false);
    }

    try {
      const data = await todoService.getTodos(40);
      if (!cachedData || cachedData.length === 0) {
        setTodos(data);
        await todoStorage.saveStoredTodos(data);
      } else {
        const localCreatedTodos = cachedData.filter((todo) => todo.id > 200);
        const apiTodos = data.filter(
          (todo) => !localCreatedTodos.some((local) => local.id === todo.id)
        );
        const mergedList = [...localCreatedTodos, ...apiTodos];
        setTodos(mergedList);
        await todoStorage.saveStoredTodos(mergedList);
      }
      setIsOfflineMode(false);
    } catch {
      if (!cachedData || cachedData.length === 0) {
        setError('Não foi possível carregar as tarefas. Verifique sua conexão.');
      }
      setIsOfflineMode(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = useCallback(async (payload: CreateTodoPayload): Promise<Todo> => {
    setError(null);
    const newTodo: Todo = {
      id: Date.now(),
      userId: 1,
      title: payload.title.trim(),
      completed: payload.completed ?? false,
      description: payload.description?.trim() || undefined,
    };

    setTodos((prev) => {
      const updated = [newTodo, ...prev];
      todoStorage.saveStoredTodos(updated);
      return updated;
    });

    try {
      await todoService.createTodo(payload);
    } catch {
      setIsOfflineMode(true);
    }

    return newTodo;
  }, []);

  const restoreTodo = useCallback(async (todoToRestore: Todo): Promise<void> => {
    setError(null);
    setTodos((prev) => {
      const updated = [todoToRestore, ...prev];
      todoStorage.saveStoredTodos(updated);
      return updated;
    });
  }, []);

  const updateTodo = useCallback(async (id: number, payload: UpdateTodoPayload): Promise<boolean> => {
    setError(null);

    setTodos((prev) => {
      const updated = prev.map((todo) => {
        if (todo.id === id) {
          const updatedItem = { ...todo };
          if (payload.title !== undefined) updatedItem.title = payload.title;
          if (payload.completed !== undefined) updatedItem.completed = payload.completed;
          if (payload.description !== undefined) updatedItem.description = payload.description;
          return updatedItem;
        }
        return todo;
      });
      todoStorage.saveStoredTodos(updated);
      return updated;
    });

    try {
      await todoService.updateTodo(id, payload);
    } catch {
      setIsOfflineMode(true);
    }

    return true;
  }, []);

  const toggleTodoStatus = useCallback(async (id: number): Promise<void> => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;
    await updateTodo(id, { completed: !target.completed });
  }, [todos, updateTodo]);

  const deleteTodo = useCallback(async (id: number): Promise<boolean> => {
    setError(null);

    setTodos((prev) => {
      const updated = prev.filter((todo) => todo.id !== id);
      todoStorage.saveStoredTodos(updated);
      return updated;
    });

    try {
      await todoService.deleteTodo(id);
    } catch {
      setIsOfflineMode(true);
    }

    return true;
  }, []);

  const clearCompletedTodos = useCallback(async (): Promise<void> => {
    setError(null);

    const completedTodos = todos.filter((t) => t.completed);
    setTodos((prev) => {
      const updated = prev.filter((todo) => !todo.completed);
      todoStorage.saveStoredTodos(updated);
      return updated;
    });

    for (const todo of completedTodos) {
      try {
        await todoService.deleteTodo(todo.id);
      } catch {
        setIsOfflineMode(true);
      }
    }
  }, [todos]);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setStatusFilter = useCallback((status: StatusFilter) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const filteredTodos = useMemo(() => {
    const query = filters.searchQuery.toLowerCase().trim();

    return todos.filter((todo) => {
      const matchesSearch =
        !query ||
        todo.title.toLowerCase().includes(query) ||
        (todo.description && todo.description.toLowerCase().includes(query));

      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'completed' && todo.completed) ||
        (filters.status === 'pending' && !todo.completed);

      return matchesSearch && matchesStatus;
    });
  }, [todos, filters]);

  return {
    todos,
    filteredTodos,
    loading,
    error,
    isOfflineMode,
    filters,
    fetchTodos,
    addTodo,
    restoreTodo,
    updateTodo,
    toggleTodoStatus,
    deleteTodo,
    clearCompletedTodos,
    setSearchQuery,
    setStatusFilter,
  };
}
