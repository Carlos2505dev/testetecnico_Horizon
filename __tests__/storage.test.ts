import AsyncStorage from '@react-native-async-storage/async-storage';
import { todoStorage } from '../src/storage/todo-storage';
import { Todo } from '../src/types/todo';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('Storage de Tarefas (todoStorage)', () => {
  const mockTodos: Todo[] = [
    {
      id: 1,
      userId: 1,
      title: 'Tarefa 1',
      completed: false,
      description: 'Obs 1',
    },
    {
      id: 2,
      userId: 1,
      title: 'Tarefa 2',
      completed: true,
      description: 'Obs 2',
    },
  ];

  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('deve retornar null se não houver dados gravados no storage', async () => {
    const todos = await todoStorage.getStoredTodos();
    expect(todos).toBeNull();
  });

  it('deve salvar e carregar as tarefas do storage com sucesso', async () => {
    await todoStorage.saveStoredTodos(mockTodos);
    const todos = await todoStorage.getStoredTodos();
    expect(todos).toHaveLength(2);
    expect(todos).toEqual(mockTodos);
  });

  it('deve limpar as tarefas do storage com sucesso', async () => {
    await todoStorage.saveStoredTodos(mockTodos);
    await todoStorage.clearStoredTodos();
    const todos = await todoStorage.getStoredTodos();
    expect(todos).toBeNull();
  });

  it('deve tratar erros de leitura retornando null', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Erro de leitura'));
    const todos = await todoStorage.getStoredTodos();
    expect(todos).toBeNull();
  });
});

