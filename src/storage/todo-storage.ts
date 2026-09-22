import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '../types/todo';

const STORAGE_KEY = '@todo_horizon:todos';

export const todoStorage = {
  async getStoredTodos(): Promise<Todo[] | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as Todo[];
    } catch {
      return null;
    }
  },

  async saveStoredTodos(todos: Todo[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Erro ao salvar tarefas no AsyncStorage:', error);
    }
  },

  async clearStoredTodos(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar tarefas do AsyncStorage:', error);
    }
  },
};
