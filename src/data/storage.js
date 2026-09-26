import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@atividades';

export async function carregarAtividades() {
  try {
    const atividadesSalvas = await AsyncStorage.getItem(STORAGE_KEY);
    const lista = atividadesSalvas ? JSON.parse(atividadesSalvas) : [];
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    console.log('Erro ao carregar atividades:', error);
    return [];
  }
}

export async function salvarAtividades(lista) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  } catch (error) {
    console.log('Erro ao salvar atividades:', error);
  }
}

export async function adicionarAtividade(novaAtividade) {
  try {
    const atividades = await carregarAtividades();
    const listaAtualizada = [...atividades, novaAtividade];
    await salvarAtividades(listaAtualizada);
    return listaAtualizada;
  } catch (error) {
    console.log('Erro ao adicionar atividade:', error);
    return [];
  }
}

export async function atualizarAtividade(id, camposAlterados) {
  try {
    const atividades = await carregarAtividades();
    const listaAtualizada = atividades.map((item) =>
      String(item.id) === String(id) ? { ...item, ...camposAlterados } : item
    );
    await salvarAtividades(listaAtualizada);
    return listaAtualizada;
  } catch (error) {
    console.log('Erro ao atualizar atividade:', error);
    return [];
  }
}

export async function excluirAtividade(id) {
  try {
    const atividades = await carregarAtividades();
    const listaAtualizada = atividades.filter(
      (item) => String(item.id) !== String(id)
    );
    await salvarAtividades(listaAtualizada);
    return listaAtualizada;
  } catch (error) {
    console.log('Erro ao excluir atividade:', error);
    return [];
  }
}