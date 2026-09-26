import * as SQLite from 'expo-sqlite';
import { STATUS_CORES, STATUS_OPCOES } from './status';

const DATABASE_NAME = 'educamirim.db';
const CONSULTA_ATIVIDADES = `
  SELECT
    a.id,
    a.titulo,
    a.materia,
    a.prazo,
    a.status_id,
    a.criado_em,
    s.nome AS status_nome,
    s.cor AS status_cor
  FROM atividades a
  LEFT JOIN status s ON s.id = a.status_id
`;

let db = null;
let aberturaPromise = null;
let inicializacaoPromise = null;

export async function abrirBanco() {
  try {
    if (db) return db;

    if (!aberturaPromise) {
      aberturaPromise = (async () => {
        const bancoAberto = await SQLite.openDatabaseAsync(DATABASE_NAME);
        await bancoAberto.execAsync('PRAGMA foreign_keys = ON');
        db = bancoAberto;
        return bancoAberto;
      })();
    }

    return await aberturaPromise;
  } catch (error) {
    aberturaPromise = null;
    console.log('Erro ao abrir o banco de dados:', error);
    throw error;
  }
}

export async function inicializarBanco() {
  if (inicializacaoPromise) return inicializacaoPromise;

  inicializacaoPromise = (async () => {
    try {
      const banco = await abrirBanco();

      await banco.execAsync(`
        CREATE TABLE IF NOT EXISTS status (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL UNIQUE,
          cor TEXT NOT NULL,
          padrao INTEGER NOT NULL DEFAULT 0
        )
      `);

      await banco.execAsync(`
        CREATE TABLE IF NOT EXISTS atividades (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          materia TEXT,
          prazo TEXT,
          status_id INTEGER,
          criado_em TEXT NOT NULL,
          FOREIGN KEY (status_id) REFERENCES status (id)
        )
      `);

      for (const nome of STATUS_OPCOES) {
        await banco.runAsync(
          'INSERT OR IGNORE INTO status (nome, cor, padrao) VALUES (?, ?, 1)',
          [nome, STATUS_CORES[nome]]
        );
      }

      return banco;
    } catch (error) {
      inicializacaoPromise = null;
      console.log('Erro ao inicializar o banco de dados:', error);
      throw error;
    }
  })();

  return inicializacaoPromise;
}

export async function resetarBanco() {
  try {
    if (db) await db.closeAsync();
    db = null;
    aberturaPromise = null;
    inicializacaoPromise = null;
    await SQLite.deleteDatabaseAsync(DATABASE_NAME);
    return await inicializarBanco();
  } catch (error) {
    console.log('Erro ao resetar o banco de dados:', error);
    throw error;
  }
}

export async function criarAtividade({ titulo, materia = null, prazo = null, status_id = null }) {
  try {
    const banco = await inicializarBanco();
    const criadoEm = new Date().toISOString();
    const resultado = await banco.runAsync(
      `INSERT INTO atividades (titulo, materia, prazo, status_id, criado_em)
       VALUES (?, ?, ?, ?, ?)`,
      [titulo, materia, prazo, status_id, criadoEm]
    );
    return resultado.lastInsertRowId;
  } catch (error) {
    console.log('Erro ao criar atividade:', error);
    throw error;
  }
}

export async function listarAtividades() {
  try {
    const banco = await inicializarBanco();
    return await banco.getAllAsync(`${CONSULTA_ATIVIDADES} ORDER BY a.criado_em DESC`);
  } catch (error) {
    console.log('Erro ao listar atividades:', error);
    throw error;
  }
}

export async function listarAtividadesPorStatus(status_id) {
  try {
    const banco = await inicializarBanco();
    return await banco.getAllAsync(
      `${CONSULTA_ATIVIDADES} WHERE a.status_id = ? ORDER BY a.criado_em DESC`,
      [status_id]
    );
  } catch (error) {
    console.log('Erro ao listar atividades por status:', error);
    throw error;
  }
}

export async function buscarAtividadePorId(id) {
  try {
    const banco = await inicializarBanco();
    return await banco.getFirstAsync(`${CONSULTA_ATIVIDADES} WHERE a.id = ?`, [id]);
  } catch (error) {
    console.log('Erro ao buscar atividade:', error);
    throw error;
  }
}

export async function atualizarStatusAtividade(id, status_id) {
  try {
    const banco = await inicializarBanco();
    return await banco.runAsync(
      'UPDATE atividades SET status_id = ? WHERE id = ?',
      [status_id, id]
    );
  } catch (error) {
    console.log('Erro ao atualizar status da atividade:', error);
    throw error;
  }
}

export async function atualizarAtividade(id, camposAlterados) {
  try {
    const camposPermitidos = new Set(['titulo', 'materia', 'prazo', 'status_id']);
    const campos = Object.entries(camposAlterados || {}).filter(([campo]) =>
      camposPermitidos.has(campo)
    );

    if (campos.length === 0) return { changes: 0, lastInsertRowId: 0 };

    const banco = await inicializarBanco();
    const atribuicoes = campos.map(([campo]) => `${campo} = ?`).join(', ');
    const valores = campos.map(([, valor]) => valor);

    return await banco.runAsync(
      `UPDATE atividades SET ${atribuicoes} WHERE id = ?`,
      [...valores, id]
    );
  } catch (error) {
    console.log('Erro ao atualizar atividade:', error);
    throw error;
  }
}

export async function excluirAtividade(id) {
  try {
    const banco = await inicializarBanco();
    return await banco.runAsync('DELETE FROM atividades WHERE id = ?', [id]);
  } catch (error) {
    console.log('Erro ao excluir atividade:', error);
    throw error;
  }
}

export async function listarStatus() {
  try {
    const banco = await inicializarBanco();
    return await banco.getAllAsync(
      'SELECT id, nome, cor, padrao FROM status ORDER BY padrao DESC, nome ASC'
    );
  } catch (error) {
    console.log('Erro ao listar status:', error);
    throw error;
  }
}

export async function criarStatus(nome, cor) {
  try {
    const banco = await inicializarBanco();
    const nomeNormalizado = typeof nome === 'string' ? nome.trim() : '';
    if (!nomeNormalizado) throw new Error('O nome do status é obrigatório.');

    const existente = await banco.getFirstAsync(
      'SELECT id FROM status WHERE nome = ?',
      [nomeNormalizado]
    );
    if (existente) throw new Error('Já existe um status com esse nome.');

    const resultado = await banco.runAsync(
      'INSERT INTO status (nome, cor, padrao) VALUES (?, ?, 0)',
      [nomeNormalizado, cor]
    );
    return resultado.lastInsertRowId;
  } catch (error) {
    console.log('Erro ao criar status:', error);
    throw error;
  }
}

export async function excluirStatus(id) {
  try {
    const banco = await inicializarBanco();
    const status = await banco.getFirstAsync(
      'SELECT padrao FROM status WHERE id = ?',
      [id]
    );
    if (!status) throw new Error('Status não encontrado.');
    if (status.padrao === 1) throw new Error('Status padrão não pode ser excluído.');

    const total = await contarAtividadesPorStatus(id);
    if (total > 0) throw new Error('O status está em uso por uma ou mais atividades.');

    return await banco.runAsync('DELETE FROM status WHERE id = ?', [id]);
  } catch (error) {
    console.log('Erro ao excluir status:', error);
    throw error;
  }
}

export async function contarAtividadesPorStatus(status_id) {
  try {
    const banco = await inicializarBanco();
    const resultado = await banco.getFirstAsync(
      'SELECT COUNT(*) AS total FROM atividades WHERE status_id = ?',
      [status_id]
    );
    return resultado?.total ?? 0;
  } catch (error) {
    console.log('Erro ao contar atividades por status:', error);
    throw error;
  }
}