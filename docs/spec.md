# Especificação Técnica do Projeto - To-Do Horizon

## 1. Visão Geral do Projeto

O To-Do Horizon é um aplicativo móvel de gerenciamento de tarefas desenvolvido em React Native com TypeScript e Expo Router. O aplicativo consome a API pública JSONPlaceholder (endpoint `/todos`) e implementa um fluxo completo de CRUD (Criar, Ler, Atualizar e Deletar) de tarefas com suporte a sincronização local e funcionamento offline.

Como a API JSONPlaceholder simula as operações de alteração de dados sem persistência real no backend, o aplicativo trata a camada de dados localmente via React Context (`TodoContext`), garantindo a consistência das informações entre a memória da aplicação, o armazenamento local do dispositivo (`AsyncStorage`) e as respostas simuladas da API.

---

## 2. Arquitetura e Organização de Código

A aplicação adota uma arquitetura em camadas orientada a responsabilidades bem definidas, facilitando a testabilidade, manutenção e reaproveitamento de código:

### 2.1 Camada de Tipos (`src/types`)

Definição dos contratos de dados (Interfaces e Types TypeScript) utilizados no aplicativo.

- `Todo`: Estrutura da tarefa (`id`, `title`, `completed`, `userId`, `description`, `createdAt`).
- `CreateTodoPayload`: Dados necessários para criação de nova tarefa.
- `UpdateTodoPayload`: Dados permitidos para alteração de tarefa existente.
- `TodoFilters`: Critérios de busca por texto e filtro de status (`all`, `pending`, `completed`).

### 2.2 Camada de Serviços de API (`src/services`)

Responsável pela comunicação HTTP com o backend (JSONPlaceholder).

- `api`: Cliente HTTP customizado configurado para requisições de rede.
- `todoService`: Métodos para `getTodos`, `createTodo`, `updateTodo` e `deleteTodo`.

### 2.3 Camada de Armazenamento Local / Repositório (`src/storage`)

Gerencia o armazenamento persistente no dispositivo utilizando `@react-native-async-storage/async-storage`.

- `todoStorage`: Leitura, gravação e limpeza do cache local no dispositivo.
- Suporte a funcionamento offline completo com fallback automático.

### 2.4 Camada de Estado Global (`src/context` e `src/hooks`)

Centralização do estado reativo e regras de negócio da aplicação.

- `TodoContext`: Provedor central que mantém a única fonte da verdade (*Single Source of Truth*) para todas as telas.
- `useTodos`: Custom hook que disponibiliza o contexto de tarefas para os componentes da aplicação.

### 2.5 Camada de Interface do Usuário (`src/components` e `src/app`)

- `src/app`: Rotas do Expo Router (`index` para lista principal, `todo/[id]` para detalhes e `todo/form` para formulário modal).
- `src/components`: Componentes reutilizáveis de interface (TodoItem, TodoFilter, TodoProgressBar, DeleteConfirmModal, UiState e UiToast).

---

## 3. Requisitos Funcionais

### 3.1 Listagem de Tarefas

- Exibir a lista de tarefas obtida da API ou do armazenamento local.
- Apresentar o status visual de cada tarefa (concluída ou pendente) com badges e ícones indicativos.
- Permitir alternar o status de conclusão diretamente na lista através de uma ação rápida (toggle).
- Exibir indicador visual de progresso ("X de Y concluídas") e barra proporcional.

### 3.2 Criação de Tarefas

- Oferecer formulário modal para inclusão de uma nova tarefa.
- Solicitar os campos: Título (obrigatório), Observações/Descrição (opcional) e Status inicial (pendente ou concluída).
- Salvar a nova tarefa com timestamp de criação e persistir no armazenamento local.

### 3.3 Edição de Tarefas

- Permitir alterar o título, observações/descrição e o status de uma tarefa existente.
- Atualizar o estado global (`TodoContext`) e o armazenamento local em tempo real.

### 3.4 Exclusão de Tarefas

- Permitir a remoção individual de uma tarefa ou a limpeza em lote de tarefas concluídas.
- Exibir obrigatoriamente um modal de confirmação antes de efetivar a exclusão.
- Oferecer toast com opção de desfazer (Undo) após excluir uma tarefa.

### 3.5 Detalhes da Tarefa

- Ao tocar em um item da lista, navegar para uma tela de detalhes dedicada.
- Exibir informações completas da tarefa: título, status de conclusão, observações detalhadas e horário de criação formatado.

### 3.6 Busca e Filtragem Locais

- Campo de busca por texto para filtrar tarefas por título e observações/descrição.
- Filtro por status: Exibir todas, apenas pendentes ou apenas concluídas.
- A filtragem ocorre de forma estritamente local, sem realizar chamadas de rede adicionais à API a cada tecla digitada.

---

## 4. Validação de Formulário

As validações de criação e edição de tarefas seguem as regras:

1. **Obrigatoriedade do Título:** O campo de título não pode ser vazio ou composto apenas por espaços em branco.
2. **Tamanho Mínimo:** O título deve conter no mínimo 3 caracteres válidos.
3. **Tamanho Máximo:** O título deve conter no máximo 100 caracteres.
4. **Descrição Opcional:** Campo de observações com suporte a até 500 caracteres.
5. **Feedback Visual de Erro:** Exibição de mensagens claras de alerta e feedback háptico em caso de tentativa de envio inválido.

---

## 5. Tratamento de Estados da Interface (UI States)

A interface responde de maneira clara e fluida aos três estados principais da aplicação:

### 5.1 Estado de Carregamento (Loading)

- Exibir um indicador visual de carregamento enquanto as tarefas estão sendo carregadas.
- Desabilitar botões de ação durante o envio de formulários para evitar duplicidade de requisições.

### 5.2 Estado de Erro / Modo Offline

- Tratar falhas de conexão de rede ou erros de resposta da API.
- Apresentar banner laranja amigável informando que a aplicação está operando em Modo Offline.
- Disponibilizar botão de nova tentativa ("Tentar novamente") para reconexão.

### 5.3 Estado de Lista Vazia (Empty State)

- Exibir mensagem ilustrativa e explicativa quando não houver tarefas cadastradas ou quando a busca não retornar resultados.
- Oferecer uma ação rápida para criar a primeira tarefa quando a lista estiver vazia.

---

## 6. Estratégia de Persistência Local de Dados

1. **Primeira abertura (Online):** O app realiza o fetch inicial no endpoint `/todos`, salva os dados recebidos no AsyncStorage e renderiza na tela.
2. **Operações de CRUD:** As alterações (POST, PATCH, DELETE) são aplicadas no estado global (`TodoContext`) e salvas no `AsyncStorage`, simulando persistência real.
3. **Reabertura do App / Modo Offline:** O aplicativo lê os dados do armazenamento local antes de tentar a busca na rede, garantindo exibição instantânea e suporte offline.
