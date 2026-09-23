import { validateTodoTitle } from '../src/utils/validation';

describe('validateTodoTitle', () => {
  it('deve retornar erro se o título estiver vazio ou contiver apenas espaços', () => {
    expect(validateTodoTitle('')).toEqual({
      title: 'O campo de título é obrigatório.',
    });
    expect(validateTodoTitle('   ')).toEqual({
      title: 'O campo de título é obrigatório.',
    });
  });

  it('deve retornar erro se o título tiver menos de 3 caracteres', () => {
    expect(validateTodoTitle('ab')).toEqual({
      title: 'O título deve conter no mínimo 3 caracteres.',
    });
  });

  it('deve retornar erro se o título tiver mais de 100 caracteres', () => {
    const longTitle = 'a'.repeat(101);
    expect(validateTodoTitle(longTitle)).toEqual({
      title: 'O título deve conter no máximo 100 caracteres.',
    });
  });

  it('deve retornar null para títulos válidos entre 3 e 100 caracteres', () => {
    expect(validateTodoTitle('Estudar React Native')).toBeNull();
    expect(validateTodoTitle('  Finalizar projeto  ')).toBeNull();
    expect(validateTodoTitle('a'.repeat(100))).toBeNull();
  });
});
