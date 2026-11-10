# Documentação Técnica e Funcional: EducaMirim

## 1. Apresentação

O EducaMirim é um aplicativo móvel para organizar atividades escolares, prazos e status de conclusão. O fluxo de atividades usa SQLite como fonte única de dados e oferece cadastro, consulta, edição e exclusão. O app também pode agendar lembretes locais de prazo no aparelho. Login, mural, grade semanal, trabalhos em grupo, contador de gamificação e prévia do Google Agenda continuam sendo demonstrações visuais, sem conexão com serviços externos.

Equipe VIISRE:

- Isabela Stefanelle Paulino dos Santos
- Rebeka Janson Gomes
- Victoria Monique Leal Lima

## 2. Telas

### Lista de atividades

Consulta atividades e status do SQLite, permite filtrar por status, abrir detalhes e excluir uma atividade após confirmação. Durante a leitura, exibe loading; sem registros, apresenta empty state com ícone, mensagem e atalho para cadastro. Erros de leitura e exclusão exibem mensagens amigáveis. O contador de gamificação mostra o total de atividades concluídas salvas no banco.

### Adicionar atividade

Permite informar título obrigatório, matéria, prazo e status. O título é validado com `trim()`. A seleção de prazo usa o DateTimePicker; na web, aceita `DD/MM/AAAA HH:mm`. Os dados são gravados no SQLite. O mesmo formulário é reutilizado para editar os campos de uma atividade existente.

### Detalhe da atividade

Apresenta título, matéria, prazo e status. A alteração de status e a edição dos demais campos são persistidas com `UPDATE`; a exclusão exige confirmação. Em Android e iOS, é possível solicitar um lembrete local uma hora antes do prazo. O app pede permissão somente quando o usuário ativa o lembrete; o identificador do agendamento fica no SQLite e o lembrete pode ser cancelado. A edição remove o agendamento anterior para evitar um aviso com prazo desatualizado. O botão Google Agenda exibe uma mensagem de demonstração e não sincroniza dados.

### Mural de avisos

Exibe uma grade de aulas e um aviso estáticos, identificados como conteúdo de demonstração. Nenhum dado escolar real é consultado.

### Login demonstrativo

Permite selecionar um perfil de aluno ou professor e navegar para a lista. Os campos são apenas visuais: não há autenticação, envio ou armazenamento de credenciais.

### Grade semanal

Apresenta horários e matérias estáticos para demonstrar uma possível visão escolar. Os dados não são atualizados pela secretaria.

### Trabalhos em grupo

Apresenta projetos e etapas fictícios. As etapas não são subtarefas persistidas no SQLite.

## 3. Persistência e navegação

- `src/data/database.js` abre `educamirim.db`, cria as tabelas `atividades` e `status`, insere os status padrão e implementa as operações SQLite usadas pelo app.
- A tabela `lembretes`, também em SQLite, relaciona cada atividade ao identificador da notificação local agendada.
- `src/data/status.js` define os status e suas cores padrão; `src/data/theme.js` mantém a paleta compartilhada.
- `src/data/storage.js` preserva a implementação AsyncStorage da Fase 2. O fluxo atual de atividades usa SQLite.
- `src/data/notifications.js` encapsula o agendamento e o cancelamento de notificações locais. O recurso não é disponibilizado na web.
- O Stack Navigator contém as rotas Login, Lista, Detalhe, Adicionar, Avisos, Grade e Projetos.

## 4. Executar

Instale as dependências e inicie o Expo:

```bash
npm install
npx expo start --clear
```

Abra o projeto no Expo Go pelo QR Code ou em um emulador compatível.
Os lembretes locais estão disponíveis nos aplicativos Android e iOS; a versão web mantém o CRUD, mas não oferece notificações.

## 6. Fase 4 – Entrega e apresentação

- CRUD de atividades completo e persistido apenas no SQLite.
- Lembrete local opcional de prazo, agendado uma hora antes em Android e iOS, com permissão solicitada por ação do usuário.
- UX com loading durante a leitura da lista, empty state com ícone e atalho de cadastro e mensagens amigáveis para falhas de leitura, gravação e exclusão.
- Para testar, execute os comandos da seção anterior e abra o QR Code no Expo Go. O APK não é necessário para esse teste.
- Sugestão de apresentação: demonstrar o cadastro, a edição, a mudança de status, o filtro e a exclusão; mostrar o empty state e ativar um lembrete em um aparelho com notificações permitidas.

## 5. Tecnologias

- React Native e Expo
- JavaScript
- SQLite com `expo-sqlite`
- Notificações locais com `expo-notifications`
- AsyncStorage, mantido como implementação da Fase 2
- React Navigation
- DateTimePicker
