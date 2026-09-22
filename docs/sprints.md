# Planejamento de Sprints e Tarefas - To-Do Horizon

Este documento estabelece o plano sequencial de desenvolvimento em sprints do projeto To-Do Horizon. As tarefas são estruturadas em entregas incrementais pequenas e médias para facilitar o envio gradual de commits mantendo a rastreabilidade do repositório.

---

## Sprint 1: Estrutura Base, Tipos e Comunicação de Dados

Objetivo: Configurar os contratos de dados (TypeScript), cliente HTTP para a API pública JSONPlaceholder e o wrapper de armazenamento local (AsyncStorage).

- [ ] Task 1.1: Criar interfaces e tipos de dados da aplicação (`src/types/todo.ts`).
  Commit sugerido: `feat(types): add todo data models and filter types`

- [ ] Task 1.2: Instalar a biblioteca de armazenamento local `@react-native-async-storage/async-storage`.
  Commit sugerido: `chore(deps): install async-storage package`

- [ ] Task 1.3: Criar cliente de API e serviço de comunicação HTTP (`src/services/api.ts` e `src/services/todo-service.ts`).
  Commit sugerido: `feat(services): implement jsonplaceholder api client and todo service`

- [ ] Task 1.4: Criar módulo de persistência local para cache e operações offline (`src/storage/todo-storage.ts`).
  Commit sugerido: `feat(storage): implement asyncstorage wrapper for todo caching`

---

## Sprint 2: Gerenciamento de Estado Global e Regras de Negócio

Objetivo: Implementar a lógica de negócio, sincronização entre cache local e API e otimização de busca local.

- [ ] Task 2.1: Criar hook customizado `useTodos` para controle de estado das tarefas e operações CRUD (`src/hooks/use-todos.ts`).
  Commit sugerido: `feat(hooks): implement useTodos custom hook for state and crud management`

- [ ] Task 2.2: Implementar fallback de dados offline e sincronização automática de alterações locais no `useTodos`.
  Commit sugerido: `feat(hooks): integrate local storage persistence with API fallback in useTodos`

- [ ] Task 2.3: Criar hook auxiliar `useDebounce` para otimização do filtro de texto (`src/hooks/use-debounce.ts`).
  Commit sugerido: `feat(hooks): implement useDebounce hook for search input optimization`

---

## Sprint 3: Componentes Reutilizáveis de Interface (UI)

Objetivo: Desenvolver componentes modulares de interface do usuário, contemplando cards, busca, filtros e estados visuais.

- [ ] Task 3.1: Criar componente de Card de Tarefa com alternância rápida de status (`src/components/todo-item.tsx`).
  Commit sugerido: `feat(ui): create TodoItem card component with status toggle`

- [ ] Task 3.2: Criar componente de Busca e Seletor de Filtro de Status (`src/components/todo-filter.tsx`).
  Commit sugerido: `feat(ui): create TodoFilter search input and status selector`

- [ ] Task 3.3: Criar componentes para os estados de Carregamento, Erro e Lista Vazia (`src/components/ui-state/...`).
  Commit sugerido: `feat(ui): implement Loading, Error, and Empty state components`

- [ ] Task 3.4: Criar Modal de Confirmação para exclusão de tarefas (`src/components/delete-confirm-modal.tsx`).
  Commit sugerido: `feat(ui): implement DeleteConfirmModal component`

---

## Sprint 4: Rotas, Navegação e Fluxos de CRUD

Objetivo: Configurar as telas do aplicativo com Expo Router e realizar a integração com os hooks e componentes.

- [ ] Task 4.1: Atualizar a tela principal para integrar listagem, filtros e tratamento de estados (`src/app/index.tsx`).
  Commit sugerido: `feat(screens): integrate list, filters, and ui states into main home screen`

- [ ] Task 4.2: Criar a tela de detalhe completo da tarefa (`src/app/todo/[id].tsx`).
  Commit sugerido: `feat(screens): create task detail screen with full todo information`

- [ ] Task 4.3: Criar o formulário de criação e edição de tarefas (`src/app/todo/form.tsx` ou modal dedicado).
  Commit sugerido: `feat(screens): implement task creation and edition form screen`

- [ ] Task 4.4: Configurar rotas e navegação em pilha (Stack Layout) no Expo Router (`src/app/_layout.tsx`).
  Commit sugerido: `feat(navigation): configure Expo Router stack navigation for todo flow`

---

## Sprint 5: Validações, Feedback Visual e Polimento

Objetivo: Aplicar as regras estritas de validação de formulário, mensagens de erro visuais e refinamento dos temas claro/escuro.

- [ ] Task 5.1: Implementar validação do título (obrigatório, de 3 a 100 caracteres) com feedback visual claro.
  Commit sugerido: `feat(validation): implement title validation rules and error visual feedback`

- [ ] Task 5.2: Garantir a confirmação prévia antes de efetivar qualquer exclusão de tarefa.
  Commit sugerido: `feat(crud): require user confirmation before deleting todo items`

- [ ] Task 5.3: Refinar suporte a temas claro/escuro e ajustes de contraste (`src/constants/theme.ts`).
  Commit sugerido: `style(theme): enhance dark mode contrast and color scheme harmony`

---

## Sprint 6: Testes Unitários, QA e Documentação Final

Objetivo: Adicionar cobertura de testes unitários para regras de negócio e atualizar a documentação do repositório.

- [ ] Task 6.1: Configurar ambiente de testes com Jest e React Native Testing Library.
  Commit sugerido: `test(setup): configure Jest and Testing Library environment`

- [ ] Task 6.2: Escrever testes unitários para as regras de validação de formulário e lógica de filtro.
  Commit sugerido: `test(validation): add unit tests for form validation and search filter logic`

- [ ] Task 6.3: Escrever testes unitários para o hook `useTodos` e gerenciamento de storage.
  Commit sugerido: `test(hooks): add unit tests for useTodos and local storage`

- [ ] Task 6.4: Atualizar o arquivo `README.md` com instruções detalhadas de execução e decisões de arquitetura.
  Commit sugerido: `docs: update README with setup instructions and architectural overview`
