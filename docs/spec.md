# Especificação Técnica do Projeto - To-Do Horizon

## 1. Visão Geral do Projeto

O To-Do Horizon é um aplicativo móvel de gerenciamento de tarefas desenvolvido em React Native com TypeScript e Expo Router. O aplicativo consome a API pública JSONPlaceholder (endpoint `/todos`) e implementa um fluxo completo de CRUD (Criar, Ler, Atualizar e Deletar) de tarefas com suporte a sincronização local e funcionamento offline.

Como a API JSONPlaceholder simula as operações de alteração de dados sem persistência real no backend, o aplicativo trata a camada de dados localmente, garantindo a consistência das informações entre a memória da aplicação, o armazenamento local do dispositivo e as respostas simuladas da API.

---

## 2. Arquitetura e Organização de Código

A aplicação adota uma arquitetura em camadas orientada a responsabilidades bem definidas, facilitando a testabilidade, manutenção e reaproveitamento de código:

### 2.1 Camada de Tipos (`src/types`)

Definição dos contratos de dados (Interfaces e Types TypeScript) utilizados no aplicativo.

- `Todo`: Estrutura da tarefa (`id`, `title`, `completed`, `userId`).
- `CreateTodoPayload`: Dados necessários para criação de nova tarefa.
- `UpdateTodoPayload`: Dados permitidos para alteração de tarefa existente.
- `FilterOptions`: Critérios de busca por texto e filtro de status (`all`, `pending`, `completed`).

### 2.2 Camada de Serviços de API (`src/services`)

Responsável pela comunicação HTTP com o backend (JSONPlaceholder).

- `apiClient`: Instância configurada para requisições de rede.
- `todoService`: Métodos para `getTodos`, `createTodo`, `updateTodo` e `deleteTodo`.

### 2.3 Camada de Armazenamento Local / Repositório (`src/storage`)

Gerencia o armazenamento persistente no dispositivo utilizando `@react-native-async-storage/async-storage`.

- Leitura do cache local na inicialização.
- Gravação de alterações (inclusões, edições e remoções) no armazenamento interno do aparelho.
- Suporte a funcionamento offline parcial.

### 2.4 Camada de Estado e Regras de Negócio (`src/hooks`)

Custom hooks que centralizam a lógica de estado global/local, filtragem e sincronização de dados.

- `useTodos`: Hook principal para gestão das tarefas, estados de carregamento, erros e ações de CRUD.
- `useDebounce`: Hook auxiliar para otimização do filtro de busca por texto sem re-renderizações excessivas.

### 2.5 Camada de Interface do Usuário (`src/components` e `src/app`)

- `src/app`: Rotas e telas do Expo Router (Lista principal, Detalhes da tarefa, Modal de formulário/edição).
- `src/components`: Componentes reutilizáveis de interface (Card de Tarefa, Modal de Confirmação, Campos de Formulário, Indicadores de Estado).

---

## 3. Requisitos Funcionais

### 3.1 Listagem de Tarefas

- Exibir a lista de tarefas obtida da API ou do armazenamento local.
- Apresentar o status visual de cada tarefa (concluída ou pendente).
- Permitir alternar o status de conclusão diretamente na lista através de uma ação rápida (toggle).

### 3.2 Criação de Tarefas

- Oferecer formulário para inclusão de uma nova tarefa.
- Solicitar os campos: Título (obrigatório) e Status inicial (pendente ou concluída).
- Gerar ID único para a nova tarefa e salvar no armazenamento local.

### 3.3 Edição de Tarefas

- Permitir alterar o título e/ou o status de uma tarefa existente.
- Atualizar a lista e o armazenamento local de forma consistente.

### 3.4 Exclusão de Tarefas

- Permitir a remoção de uma tarefa selecionada.
- Exibir obrigatoriamente um modal de confirmação antes de efetivar a exclusão.
- Remover a tarefa do estado da aplicação e do armazenamento local após a confirmação.

### 3.5 Detalhes da Tarefa

- Ao tocar em um item da lista, navegar para uma tela de detalhes dedicada.
- Exibir informações completas da tarefa: ID, título, status de conclusão e identificador do usuário.

### 3.6 Busca e Filtragem Locais

- Campo de busca por texto para filtrar tarefas pelo título.
- Filtro por status: Exibir todas, apenas pendentes ou apenas concluídas.
- A filtragem deve ocorrer de forma estritamente local, sem realizar chamadas de rede adicionais à API a cada tecla digitada.

---

## 4. Validação de Formulário

As validações de criação e edição de tarefas devem seguir estritamente as regras abaixo:

1. **Obrigatoriedade do Título:** O campo de título não pode ser vazio ou composto apenas por espaços em branco.
2. **Tamanho Mínimo:** O título deve conter no mínimo 3 caracteres válidos.
3. **Tamanho Máximo:** O título deve conter no máximo 100 caracteres.
4. **Feedback Visual de Erro:** Caso o usuário tente submeter o formulário fora dessas condições, a interface deve exibir mensagens de erro claras logo abaixo do campo correspondente, impedindo a submissão.

---

## 5. Tratamento de Estados da Interface (UI States)

A interface deve responder de maneira clara e fluida aos três estados principais da aplicação:

### 5.1 Estado de Carregamento (Loading)

- Exibir um indicador visual de carregamento (spinner/skeleton layout) enquanto as tarefas estão sendo buscadas da API ou lidas do armazenamento local.
- Desabilitar botões de ação durante o envio de formulários para evitar duplicidade de requisições.

### 5.2 Estado de Erro (Error / Sem Conexão)

- Tratar falhas de conexão de rede ou erros de resposta da API.
- Apresentar mensagem amigável ao usuário informando o problema.
- Disponibilizar um botão para tentar carregar novamente (Retry action) ou chavear para os dados salvos localmente em cache.

### 5.3 Estado de Lista Vazia (Empty State)

- Exibir mensagem ilustrativa e explicativa quando não houver tarefas cadastradas ou quando a busca/filtro não retornar nenhum resultado.
- Oferecer uma ação rápida para adicionar uma nova tarefa quando a lista geral estiver vazia.

---

## 6. Estratégia de Persistência Local de Dados

Dado o comportamento simulado do backend (JSONPlaceholder):

1. **Primeira abertura (Online):** O app realiza o fetch inicial no endpoint `/todos`, salva os dados recebidos no AsyncStorage e renderiza na tela.
2. **Operações de CRUD:**
   - Criar, editar ou excluir dispara a requisição HTTP simulada à API para validar o contrato.
   - Em paralelo (ou logo após a resposta), a alteração é aplicada no estado local e persistida no AsyncStorage.
3. **Reabertura do App / Modo Offline:** O aplicativo verifica a existência dos dados no armazenamento local antes de tentar buscar da rede. Se houver dados persistidos, eles são carregados imediatamente, garantindo acesso contínuo aos dados modificados pelo usuário.
