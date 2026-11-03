# Documentação Técnica e Funcional: EducaMirim

## 1. Apresentação

O EducaMirim é um aplicativo móvel para organizar atividades escolares, prazos e status de conclusão. O escopo funcional atual prioriza o CRUD local com SQLite. Login, mural, grade semanal, trabalhos em grupo, contador de gamificação e prévia do Google Agenda são demonstrações visuais, sem conexão com serviços externos.

Equipe VIISRE:

- Isabela Stefanelle Paulino dos Santos
- Rebeka Janson Gomes
- Victoria Monique Leal Lima

## 2. Telas

### Lista de atividades

Consulta atividades e status do SQLite, permite filtrar por status, abrir detalhes e excluir uma atividade após confirmação. O contador de gamificação mostra o total de atividades concluídas salvas no banco.

### Adicionar atividade

Permite informar título obrigatório, matéria, prazo e status. O título é validado com `trim()`. A seleção de prazo usa o DateTimePicker; na web, aceita `DD/MM/AAAA HH:mm`. Os dados são gravados no SQLite.

### Detalhe da atividade

Apresenta título, matéria, prazo e status. A alteração de status é persistida com `UPDATE`; a exclusão exige confirmação. O botão Google Agenda exibe uma mensagem de demonstração e não sincroniza dados.

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
- `src/data/status.js` define os status e suas cores padrão; `src/data/theme.js` mantém a paleta compartilhada.
- `src/data/storage.js` preserva a implementação AsyncStorage da Fase 2. O fluxo atual de atividades usa SQLite.
- O Stack Navigator contém as rotas Login, Lista, Detalhe, Adicionar, Avisos, Grade e Projetos.

## 4. Executar

Instale as dependências e inicie o Expo:

```bash
npm install
npx expo start --clear
```

Abra o projeto no Expo Go pelo QR Code ou em um emulador compatível.

## 5. Tecnologias

- React Native e Expo
- JavaScript
- SQLite com `expo-sqlite`
- AsyncStorage, mantido como implementação da Fase 2
- React Navigation
- DateTimePicker
