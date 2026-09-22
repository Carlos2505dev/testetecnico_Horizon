# Planejamento de Sprints e Tarefas - To-Do Horizon

Este documento estabelece o plano sequencial de desenvolvimento em sprints do projeto To-Do Horizon. As tarefas são estruturadas em entregas incrementais pequenas e médias para facilitar o envio gradual de commits mantendo a rastreabilidade do repositório.

---

## Sprint 0: Organização e Preparação da Codebase

Objetivo: Ajustar a identidade visual do app, configurar nome e ícone no Expo e realizar a limpeza de assets e arquivos desnecessários trazidos pelo starter.

- [x] Task 0.1: Atualizar o nome da aplicação, slug e identificadores no arquivo de configuração (`app.json`).
  Commit sugerido: `chore(config): atualiza nome do app e identificadores no app.json`

- [x] Task 0.2: Substituir ícones, favicon e tela de splash pelos assets oficiais da aplicação na pasta `assets/`.
  Commit sugerido: `chore(assets): atualiza ícones do aplicativo e tela de splash`

- [x] Task 0.3: Limpar assets legados, imagens não utilizadas e arquivos desnecessários trazidos pelo starter.
  Commit sugerido: `chore(refactor): remove assets não utilizados e limpa estrutura inicial do projeto`

---

## Sprint 1: Estrutura Base, Tipos e Comunicação de Dados

Objetivo: Configurar os contratos de dados (TypeScript), cliente HTTP para a API pública JSONPlaceholder e o wrapper de armazenamento local (AsyncStorage).

- [x] Task 1.1: Criar interfaces e tipos de dados da aplicação (`src/types/todo.ts`).
  Commit sugerido: `feat(types): adiciona modelos de dados do todo e tipos de filtros`

- [x] Task 1.2: Instalar a biblioteca de armazenamento local `@react-native-async-storage/async-storage`.
  Commit sugerido: `chore(deps): instala o pacote async-storage para persistência local`

- [x] Task 1.3: Criar cliente de API e serviço de comunicação HTTP (`src/services/api.ts` e `src/services/todo-service.ts`).
  Commit sugerido: `feat(services): implementa cliente de api jsonplaceholder e servico de tarefas`

- [x] Task 1.4: Criar módulo de persistência local para cache e operações offline (`src/storage/todo-storage.ts`).
  Commit sugerido: `feat(storage): implementa wrapper do asyncstorage para cache local de tarefas`

---

## Sprint 2: Gerenciamento de Estado Global e Regras de Negócio

Objetivo: Implementar a lógica de negócio, sincronização entre cache local e API e otimização de busca local.

- [x] Task 2.1: Criar hook customizado `useTodos` para controle de estado das tarefas e operações CRUD (`src/hooks/use-todos.ts`).
  Commit sugerido: `feat(hooks): implementa hook customizado useTodos para estado e operações crud`

- [x] Task 2.2: Implementar fallback de dados offline e sincronização automática de alterações locais no `useTodos`.
  Commit sugerido: `feat(hooks): integra persistência local com fallback da api no hook useTodos`

- [x] Task 2.3: Criar hook auxiliar `useDebounce` para otimização do filtro de texto (`src/hooks/use-debounce.ts`).
  Commit sugerido: `feat(hooks): implementa hook useDebounce para otimização da busca por texto`

---

## Sprint 3: Componentes Reutilizáveis de Interface (UI)

Objetivo: Desenvolver componentes modulares de interface do usuário, contemplando cards, busca, filtros e estados visuais.

- [x] Task 3.1: Criar componente de Card de Tarefa com alternância rápida de status (`src/components/todo-item.tsx`).
  Commit sugerido: `feat(ui): cria componente TodoItem com alternância de status`

- [x] Task 3.2: Criar componente de Busca e Seletor de Filtro de Status (`src/components/todo-filter.tsx`).
  Commit sugerido: `feat(ui): cria componente TodoFilter com campo de busca e seletor de status`

- [x] Task 3.3: Criar componentes para os estados de Carregamento, Erro e Lista Vazia (`src/components/ui-state/...`).
  Commit sugerido: `feat(ui): implementa componentes visuais para estados de loading, erro e lista vazia`

- [x] Task 3.4: Criar Modal de Confirmação para exclusão de tarefas (`src/components/delete-confirm-modal.tsx`).
  Commit sugerido: `feat(ui): cria modal de confirmação de exclusão de tarefa`

---

## Sprint 4: Rotas, Navegação e Fluxos de CRUD

Objetivo: Configurar as telas do aplicativo com Expo Router e realizar a integração com os hooks e componentes.

- [x] Task 4.1: Atualizar a tela principal para integrar listagem, filtros e tratamento de estados (`src/app/index.tsx`).
  Commit sugerido: `feat(screens): integra listagem, filtros e estados de ui na tela principal`

- [ ] Task 4.2: Criar a tela de detalhe completo da tarefa (`src/app/todo/[id].tsx`).
  Commit sugerido: `feat(screens): cria tela de detalhes da tarefa com informações completas`

- [ ] Task 4.3: Criar o formulário de criação e edição de tarefas (`src/app/todo/form.tsx` ou modal dedicado).
  Commit sugerido: `feat(screens): implementa formulário para criação e edição de tarefas`

- [ ] Task 4.4: Configurar rotas e navegação em pilha (Stack Layout) no Expo Router (`src/app/_layout.tsx`).
  Commit sugerido: `feat(navigation): configura navegação em pilha do expo router`

---

## Sprint 5: Validações, Feedback Visual e Polimento

Objetivo: Aplicar as regras estritas de validação de formulário, mensagens de erro visuais e refinamento dos temas claro/escuro.

- [ ] Task 5.1: Implementar validação do título (obrigatório, de 3 a 100 caracteres) com feedback visual claro.
  Commit sugerido: `feat(validation): implementa regras de validação do título e mensagens de erro`

- [ ] Task 5.2: Garantir a confirmação prévia antes de efetivar qualquer exclusão de tarefa.
  Commit sugerido: `feat(crud): adiciona confirmação obrigatória antes da exclusão de tarefas`

- [ ] Task 5.3: Refinar suporte a temas claro/escuro e ajustes de contraste (`src/constants/theme.ts`).
  Commit sugerido: `style(theme): ajusta suporte aos temas claro e escuro e contraste visual`

---

## Sprint 6: Testes Unitários, QA e Documentação Final

Objetivo: Adicionar cobertura de testes unitários para regras de negócio e atualizar a documentação do repositório.

- [ ] Task 6.1: Configurar ambiente de testes com Jest e React Native Testing Library.
  Commit sugerido: `test(setup): configura ambiente de testes com jest e react native testing library`

- [ ] Task 6.2: Escrever testes unitários para as regras de validação de formulário e lógica de filtro.
  Commit sugerido: `test(validation): adiciona testes unitários para validação de formulário e filtros`

- [ ] Task 6.3: Escrever testes unitários para o hook `useTodos` e gerenciamento de storage.
  Commit sugerido: `test(hooks): adiciona testes unitários para o hook useTodos e armazenamento local`

- [ ] Task 6.4: Atualizar o arquivo `README.md` com instruções detalhadas de execução e decisões de arquitetura.
  Commit sugerido: `docs: atualiza readme com instruções de execução e visão geral do projeto`

---

## Sprint 7: Revisão de Código e Qualidade (Code Review)

Objetivo: Realizar auditoria completa de código, verificar adesão aos princípios SOLID/Clean Code e validar acessibilidade e qualidade final.

- [ ] Task 7.1: Auditoria de código para verificação de SOLID, Clean Code e remoção de código não utilizado.
  Commit sugerido: `refactor(review): realiza auditoria de código e refatoração para boas práticas`

- [ ] Task 7.2: Validação de acessibilidade, contraste visual e consistência nos temas claro/escuro.
  Commit sugerido: `style(review): valida consistência visual e acessibilidade dos temas`

- [ ] Task 7.3: Testes de regressão e verificação final de funcionamento da aplicação.
  Commit sugerido: `test(qa): realiza verificação final de funcionamento e testes de regressão`

- [ ] Task 7.4: Auditoria das documentações do projeto.
  Commit sugerido: `docs(review): realiza auditoria das documentações do projeto e garante que estejam atualizadas e completas`

- [ ] Task 7.5: Limpeza geral do código e arquivos desnecessários.
  Commit sugerido: `refactor(review): realiza limpeza geral do código e arquivos desnecessários`
