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
      const data = await todoService.getTodos();
      if (!cachedData || cachedData.length === 0) {
        setTodos(data);
        await todoStorage.saveStoredTodos(data);
      } else {
        const mergedMap = new Map<number, Todo>();
        data.forEach((todo) => mergedMap.set(todo.id, todo));
        cachedData.forEach((todo) => mergedMap.set(todo.id, todo));
        const mergedList = Array.from(mergedMap.values());
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

  const updateTodo = useCallback(async (id: number, payload: UpdateTodoPayload): Promise<boolean> => {
    setError(null);

    setTodos((prev) => {
      const updated = prev.map((todo) =>
        todo.id === id ? { ...todo, ...payload } : todo
      );
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

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setStatusFilter = useCallback((status: StatusFilter) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch = todo.title
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase().trim());

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
    updateTodo,
    toggleTodoStatus,
    deleteTodo,
    setSearchQuery,
    setStatusFilter,
  };
}
