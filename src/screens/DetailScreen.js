import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STATUS_CORES, STATUS_COR_FALLBACK, STATUS_OPCOES } from '../data/status';
import { atualizarAtividade, carregarAtividades, excluirAtividade } from '../data/storage';
import { CORES } from '../data/theme';

const formatarPrazo = (prazo) => {
  if (!prazo) return 'Não informado';

  const data = new Date(prazo);
  if (Number.isNaN(data.getTime())) return prazo;

  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
};

const DetailScreen = ({ route, navigation }) => {
  const { id } = route.params || {};
  const [atividade, setAtividade] = useState(null);
  const [statusAtual, setStatusAtual] = useState('Pendente');
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);

      const buscarAtividade = async () => {
        const atividades = await carregarAtividades();
        const atividadeAtual = atividades.find((item) => String(item.id) === String(id)) || null;

        if (ativo) {
          setAtividade(atividadeAtual);
          setStatusAtual(atividadeAtual?.status || 'Pendente');
          setCarregando(false);
        }
      };

      buscarAtividade();
      return () => {
        ativo = false;
      };
    }, [id])
  );

  const handleChangeStatus = async (novoStatus) => {
    if (novoStatus === statusAtual) return;

    const statusAnterior = statusAtual;
    setStatusAtual(novoStatus);

    try {
      const listaAtualizada = await atualizarAtividade(atividade.id, { status: novoStatus });
      const atividadeAtualizada = listaAtualizada.find(
        (item) => String(item.id) === String(atividade.id)
      );
      if (atividadeAtualizada) setAtividade(atividadeAtualizada);
    } catch (error) {
      setStatusAtual(statusAnterior);
      Alert.alert('Erro', 'Não foi possível atualizar o status da atividade.');
    }
  };

  const handleExcluir = () => {
    Alert.alert(
      'Excluir atividade',
      'Tem certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirAtividade(atividade.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a atividade.');
            }
          },
        },
      ]
    );
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={CORES.primaria} />
        </View>
      </SafeAreaView>
    );
  }

  if (!atividade) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>Nenhuma atividade foi selecionada.</Text>
      </SafeAreaView>
    );
  }

  if (!atividade) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>Nenhuma atividade foi selecionada.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Título:</Text>
        <Text style={styles.value}>{atividade.titulo}</Text>

        <Text style={styles.label}>Matéria:</Text>
        <Text style={styles.value}>{atividade.materia}</Text>

        <Text style={styles.label}>Prazo:</Text>
        <Text style={styles.value}>{formatarPrazo(atividade.prazo)}</Text>

        <Text style={styles.label}>Status atual:</Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_CORES[statusAtual] || STATUS_COR_FALLBACK }]}>
          <Text style={styles.statusBadgeText}>{statusAtual}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Alterar status para:</Text>
      <View style={styles.statusRow}>
        {STATUS_OPCOES.map((option) => {
          const isSelected = option === statusAtual;

          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.statusOption,
                isSelected && {
                  backgroundColor: STATUS_CORES[option] || STATUS_COR_FALLBACK,
                  borderColor: STATUS_CORES[option] || STATUS_COR_FALLBACK,
                },
              ]}
              onPress={() => handleChangeStatus(option)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.statusOptionText,
                  isSelected && styles.statusOptionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleExcluir}
        activeOpacity={0.8}
      >
        <Text style={styles.deleteButtonText}>Excluir Atividade</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
    padding: 20,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: CORES.cartao,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: CORES.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: CORES.texto,
    marginTop: 12,
  },
  value: {
    fontSize: 15,
    color: CORES.textoTerciario,
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: CORES.textoSecundario,
    textAlign: 'center',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 6,
  },
  statusBadgeText: {
    color: CORES.textoBranco,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: CORES.texto,
    marginTop: 24,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statusOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: CORES.borda,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
    marginRight: 8,
    backgroundColor: CORES.cartao,
    paddingHorizontal: 4,
  },
  statusOptionText: {
    color: CORES.textoTerciario,
    fontSize: 12,
    textAlign: 'center',
  },
  statusOptionTextSelected: {
    color: CORES.textoBranco,
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 24,
    backgroundColor: CORES.cartao,
    borderColor: CORES.erro,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: CORES.erro,
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 12,
    backgroundColor: CORES.primaria,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backButtonText: {
    color: CORES.textoBranco,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailScreen;