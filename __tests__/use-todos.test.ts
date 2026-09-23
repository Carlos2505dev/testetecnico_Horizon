import { act, renderHook } from '@testing-library/react-hooks';
import { TodoProvider } from '../src/context/todo-context';
import { useTodos } from '../src/hooks/use-todos';
import { todoService } from '../src/services/todo-service';
import { todoStorage } from '../src/storage/todo-storage';
import { Todo } from '../src/types/todo';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('../src/services/todo-service');
jest.mock('../src/storage/todo-storage');

describe('Hook useTodos', () => {
  const initialTodos: Todo[] = [
    { id: 1, userId: 1, title: 'Comprar Leite', completed: false, description: 'Mercado' },
    { id: 2, userId: 1, title: 'Estudar Jest', completed: true, description: 'Testes' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (todoStorage.getStoredTodos as jest.Mock).mockImplementation(() => Promise.resolve(initialTodos));
    (todoService.getTodos as jest.Mock).mockImplementation(() => Promise.resolve(initialTodos));
  });

  it('deve carregar tarefas do storage e da API na inicialização', async () => {
    let hook: any;
    await act(async () => {
      hook = renderHook(() => useTodos(), { wrapper: TodoProvider });
    });

    expect(hook.result.current.todos).toEqual(initialTodos);
    expect(hook.result.current.loading).toBe(false);
    expect(hook.result.current.isOfflineMode).toBe(false);
  });

  it('deve adicionar uma nova tarefa com sucesso', async () => {
    (todoService.createTodo as jest.Mock).mockResolvedValue({ id: 999, title: 'Nova Tarefa' });

    let hook: any;
    await act(async () => {
      hook = renderHook(() => useTodos(), { wrapper: TodoProvider });
    });

    await act(async () => {
      await hook.result.current.addTodo({ title: 'Nova Tarefa', description: 'Descrição' });
    });

    expect(hook.result.current.todos[0].title).toBe('Nova Tarefa');
    expect(hook.result.current.todos).toHaveLength(3);
  });

  it('deve alternar o status de concluída da tarefa', async () => {
    (todoService.updateTodo as jest.Mock).mockResolvedValue({ id: 1, completed: true });

    let hook: any;
    await act(async () => {
      hook = renderHook(() => useTodos(), { wrapper: TodoProvider });
    });

    await act(async () => {
      await hook.result.current.toggleTodoStatus(1);
    });

    expect(hook.result.current.todos.find((t: Todo) => t.id === 1)?.completed).toBe(true);
  });

  it('deve remover uma tarefa por ID', async () => {
    (todoService.deleteTodo as jest.Mock).mockResolvedValue(true);

    let hook: any;
    await act(async () => {
      hook = renderHook(() => useTodos(), { wrapper: TodoProvider });
    });

    await act(async () => {
      await hook.result.current.deleteTodo(1);
    });

    expect(hook.result.current.todos.find((t: Todo) => t.id === 1)).toBeUndefined();
    expect(hook.result.current.todos).toHaveLength(1);
  });

  it('deve alternar para modo offline em caso de falha na API ao carregar', async () => {
    (todoService.getTodos as jest.Mock).mockRejectedValueOnce(new Error('Erro de conexão'));

    let hook: any;
    await act(async () => {
      hook = renderHook(() => useTodos(), { wrapper: TodoProvider });
    });

    expect(hook.result.current.isOfflineMode).toBe(true);
    expect(hook.result.current.todos).toEqual(initialTodos);
  });
});
