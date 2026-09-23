import { FormValidationError } from '../types/todo';

export function validateTodoTitle(title: string): FormValidationError | null {
  const trimmed = title.trim();

  if (!trimmed) {
    return { title: 'O campo de título é obrigatório.' };
  }

  if (trimmed.length < 3) {
    return { title: 'O título deve conter no mínimo 3 caracteres.' };
  }

  if (trimmed.length > 100) {
    return { title: 'O título deve conter no máximo 100 caracteres.' };
  }

  return null;
}
