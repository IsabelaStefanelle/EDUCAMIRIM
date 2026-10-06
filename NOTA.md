> Este arquivo e **gerado automaticamente** pelo CI a cada push na branch `main`.
> Nao edite a mao: o proximo commit do CI sobrescreve. Para ver a rodada no Actions:
> https://github.com/IsabelaStefanelle/EDUCAMIRIM/actions/workflows/pam-ci.yml

## Nota PAM I — VIISRE (atividades do Mirim)

![](https://img.shields.io/static/v1?label=Nota%20PAM%20I&message=MB&color=green)

**Nota atual: MB** · 96% (53/55 pontos) · rodada de 2026-10-06 00:06:52 · commit `c29ea8b`

Legenda: I = Insuficiente (0–25%) · R = Regular (25–50%) · B = Bom (50–75%) · MB = Muito bom (75–100%)

| Fase | Pontos | Situação |
|---|---|---|
| Fase 1 — Estrutura | 10/10 | completa |
| Fase 2 — AsyncStorage | 15/15 | completa |
| Fase 3 — SQLite | 28/30 | em desenvolvimento |

## Checklist validado

### Fase 1 — Estrutura do projeto (10/10 pts)

- [x] **(+1 pts)** README.md existe e fala do projeto/grupo — `README.md`
- [x] **(+1 pts)** Arquivo principal do app existe (App.js) — `App.js`
- [x] **(+1 pts)** package.json existe com a dependência "expo" — `expo ~57.0.25`
- [x] **(+1 pts)** Existe tela de LISTAGEM — `src/screens/ListScreen.js`
- [x] **(+1 pts)** Existem dados iniciais (seed) em arquivo de dados — `src/data/status.js`
- [x] **(+1 pts)** Existe tela de FORMULÁRIO — `src/screens/AddActivityScreen.js`
- [x] **(+1 pts)** Existe tela de DETALHE — `src/screens/DetailScreen.js`
- [x] **(+1 pts)** Dependências importadas existem no package.json (app não quebra ao abrir) — `todos os imports resolvem`
- [x] **(+1 pts)** app.json identifica o app (name/slug preenchidos) — `app.json`
- [x] **(+1 pts)** Projeto tem pelo menos 2 arquivos de tela/código — `3 arquivos de tela`

### Fase 2 — Persistência com AsyncStorage (15/15 pts)

- [x] **(+1 pts)** Dependência async-storage está no package.json — `no package.json`
- [x] **(+1 pts)** Existe import do AsyncStorage no código — `src/data/storage.js`
- [x] **(+1 pts)** Storage faz leitura com AsyncStorage.getItem — `src/data/storage.js`
- [x] **(+1 pts)** Storage grava com AsyncStorage.setItem — `src/data/storage.js`
- [x] **(+1 pts)** Existe função de CARREGAR a lista (carregar/load) — `src/data/storage.js`
- [x] **(+1 pts)** Existe função de ADICIONAR/CADASTRAR — `src/data/storage.js`
- [x] **(+1 pts)** Existe busca por id (buscar/find/getItem) — `src/data/database.js`
- [x] **(+1 pts)** Existe função de EXCLUIR/remover — `src/data/database.js`
- [x] **(+1 pts)** Formulário lê entradas com TextInput — `src/screens/AddActivityScreen.js`
- [x] **(+1 pts)** Formulário salva chamando adicionar/salvar — `src/screens/AddActivityScreen.js`
- [x] **(+1 pts)** Lista é alimentada a partir do storage — `src/screens/ListScreen.js`
- [x] **(+1 pts)** Tela de detalhe usa busca/dados do storage — `src/screens/DetailScreen.js`
- [x] **(+1 pts)** Exclusão usa confirmação (Alert.alert) — `src/screens/DetailScreen.js`
- [x] **(+1 pts)** Dados iniciais/seed são gravados na 1ª execução — `src/data/storage.js`
- [x] **(+1 pts)** Formulário valida campos (trim/length/vazio) — `src/screens/AddActivityScreen.js`

### Fase 3 — Banco de dados SQLite (28/30 pts)

- [x] **(+2x2 pts)** Dependência expo-sqlite está no package.json — `no package.json`
- [x] **(+2x2 pts)** Existe import do expo-sqlite — `src/data/database.js`
- [x] **(+2x2 pts)** Existe arquivo de banco de dados — `src/data/database.js`
- [x] **(+2x2 pts)** Cria a tabela com CREATE TABLE IF NOT EXISTS — `src/data/database.js`
- [x] **(+2x2 pts)** Insere dados com INSERT INTO — `src/data/database.js`
- [x] **(+2x2 pts)** Consulta com SELECT — `src/data/database.js`
- [x] **(+2x2 pts)** Atualiza com UPDATE — `src/data/database.js`
- [x] **(+2x2 pts)** Exclui com DELETE FROM — `src/data/database.js`
- [x] **(+2x2 pts)** Usa filtros com WHERE — `src/data/database.js`
- [x] **(+2x2 pts)** Banco aberto com openDatabaseAsync/openDatabase — `src/data/database.js`
- [x] **(+2x2 pts)** Tela de lista carrega dados do banco — `src/screens/ListScreen.js`
- [ ] **(+2x2 pts)** Formulário salva no banco (INSERT/runAsync) — `src/screens/AddActivityScreen.js`
- [x] **(+2x2 pts)** Detalhe busca no banco com WHERE/SELECT — `src/screens/DetailScreen.js`
- [x] **(+2x2 pts)** Usa async/await corretamente (mais de 2 await) — `src/data/database.js`
- [x] **(+2x2 pts)** Banco possui dados iniciais (seed inserido em SQL) — `src/data/database.js`

## Para evoluir a nota

Os itens **desmarcados** acima são exatamente o que falta no projeto. Cada rodada deste CI (a cada push) recalcula e atualiza a nota — o artefato `nota-pam` sempre mostra o valor mais recente.
