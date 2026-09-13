import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const STORAGE_KEY = '@atividades';

const getStatusColor = (status) => {
  if (status === 'Concluído') return '#4CAF50';
  if (status === 'Em andamento') return '#FF9800';
  if (status === 'Pendente') return '#F44336';
  return '#757575';
};

const ListScreen = ({ navigation }) => {
  const [atividades, setAtividades] = useState([]);

  const carregarAtividades = useCallback(async () => {
    try {
      const atividadesSalvas = await AsyncStorage.getItem(STORAGE_KEY);
      const lista = atividadesSalvas ? JSON.parse(atividadesSalvas) : [];
      setAtividades(Array.isArray(lista) ? lista : []);
    } catch (error) {
      console.log('Erro ao carregar atividades:', error);
      setAtividades([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarAtividades();
    }, [carregarAtividades])
  );

  const handleNavigateToDetail = (atividade) => {
    navigation.navigate('Detalhe', { atividade });
  };

  const handleAddActivity = () => {
    navigation.navigate('Adicionar');
  };

  const handleExcluir = (atividade) => {
    Alert.alert(
      'Excluir atividade',
      `Deseja excluir "${atividade.titulo}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const atividadesSalvas = await AsyncStorage.getItem(STORAGE_KEY);
              const lista = atividadesSalvas ? JSON.parse(atividadesSalvas) : [];
              const listaAtualizada = Array.isArray(lista)
                ? lista.filter((item) => String(item.id) !== String(atividade.id))
                : [];

              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));
              setAtividades(listaAtualizada);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a atividade.');
            }
          },
        },
      ]
    );
  };

  const renderActivityItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => handleNavigateToDetail(item)}
      onLongPress={() => handleExcluir(item)}
      delayLongPress={500}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.headerSection}>
          <Text style={styles.titleText}>{item.titulo}</Text>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.subjectText}>{item.materia}</Text>

        <View style={styles.footerSection}>
          <Text style={styles.deadlineText}>📆 {item.prazo ? item.prazo : 'Sem prazo'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={atividades}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderActivityItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma atividade cadastrada.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddActivity}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+ Adicionar Atividade</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666666',
    fontSize: 14,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  subjectText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  footerSection: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
  },
  deadlineText: {
    fontSize: 13,
    color: '#999999',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ListScreen;