import { StatusFilter, Todo } from '../src/types/todo';

function filterTodos(
  todos: Todo[],
  query: string,
  status: StatusFilter
): Todo[] {
  const searchTerm = query.toLowerCase().trim();

  return todos.filter((todo) => {
    const matchesSearch =
      !searchTerm ||
      todo.title.toLowerCase().includes(searchTerm) ||
      (todo.description && todo.description.toLowerCase().includes(searchTerm));

    const matchesStatus =
      status === 'all' ||
      (status === 'completed' && todo.completed) ||
      (status === 'pending' && !todo.completed);

    return matchesSearch && matchesStatus;
  });
}

describe('Lógica de Filtro de Tarefas (filterTodos)', () => {
  const mockTodos: Todo[] = [
    { id: 1, userId: 1, title: 'Comprar leite', completed: false, description: 'Ir ao mercado do bairro' },
    { id: 2, userId: 1, title: 'Estudar TypeScript', completed: true, description: 'Revisar Generics e Interfaces' },
    { id: 3, userId: 1, title: 'Treinar na academia', completed: false, description: 'Treino de pernas' },
    { id: 4, userId: 1, title: 'Pagar contas', completed: true, description: 'Luz e Internet' },
  ];

  it('deve retornar todas as tarefas quando o status for "all" e busca vazia', () => {
    const result = filterTodos(mockTodos, '', 'all');
    expect(result).toHaveLength(4);
  });

  it('deve filtrar apenas tarefas pendentes', () => {
    const result = filterTodos(mockTodos, '', 'pending');
    expect(result).toHaveLength(2);
    expect(result.every((t) => !t.completed)).toBe(true);
  });

  it('deve filtrar apenas tarefas concluídas', () => {
    const result = filterTodos(mockTodos, '', 'completed');
    expect(result).toHaveLength(2);
    expect(result.every((t) => t.completed)).toBe(true);
  });

  it('deve buscar corretamente por termo no título', () => {
    const result = filterTodos(mockTodos, 'leite', 'all');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('deve buscar corretamente por termo nas observações/descrição', () => {
    const result = filterTodos(mockTodos, 'mercado', 'all');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('deve combinar filtro de status e termo de busca simultaneamente', () => {
    const result = filterTodos(mockTodos, 'TypeScript', 'completed');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);

    const emptyResult = filterTodos(mockTodos, 'TypeScript', 'pending');
    expect(emptyResult).toHaveLength(0);
  });
});
