import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { atualizarAtividade, excluirAtividade } from './storage';

const STATUS_OPTIONS = ['Pendente', 'Em andamento', 'Concluído'];

const getStatusColor = (status) => {
  if (status === 'Concluído') return '#4CAF50';
  if (status === 'Em andamento') return '#FF9800';
  if (status === 'Pendente') return '#F44336';
  return '#757575';
};

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
  const { atividade } = route.params || {};
  const [statusAtual, setStatusAtual] = useState(atividade?.status || 'Pendente');

  const handleChangeStatus = async (novoStatus) => {
    if (novoStatus === statusAtual) return;

    const statusAnterior = statusAtual;
    setStatusAtual(novoStatus);

    try {
      await atualizarAtividade(atividade.id, { status: novoStatus });
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

  if (!atividade) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Nenhuma atividade foi selecionada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Título:</Text>
        <Text style={styles.value}>{atividade.titulo}</Text>

        <Text style={styles.label}>Matéria:</Text>
        <Text style={styles.value}>{atividade.materia}</Text>

        <Text style={styles.label}>Prazo:</Text>
        <Text style={styles.value}>{formatarPrazo(atividade.prazo)}</Text>

        <Text style={styles.label}>Status atual:</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(statusAtual) }]}>
          <Text style={styles.statusBadgeText}>{statusAtual}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Alterar status para:</Text>
      <View style={styles.statusRow}>
        {STATUS_OPTIONS.map((option) => {
          const isSelected = option === statusAtual;

          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.statusOption,
                isSelected && {
                  backgroundColor: getStatusColor(option),
                  borderColor: getStatusColor(option),
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 12,
  },
  value: {
    fontSize: 15,
    color: '#555555',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
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
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
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
    borderColor: '#D9D9D9',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
  },
  statusOptionText: {
    color: '#555555',
    fontSize: 12,
    textAlign: 'center',
  },
  statusOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderColor: '#D32F2F',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 12,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailScreen;