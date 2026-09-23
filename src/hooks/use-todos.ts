import { useContext } from 'react';
import { TodoContext, TodoContextType } from '../context/todo-context';

export function useTodos(): TodoContextType {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos deve ser utilizado dentro de um TodoProvider');
  }
  return context;
}
