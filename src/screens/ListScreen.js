import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  excluirAtividade,
  inicializarBanco,
  listarAtividades,
  listarAtividadesPorStatus,
  listarStatus,
} from '../data/database';
import { CORES } from '../data/theme';

const carregarListaPorFiltro = (statusId) =>
  statusId === null ? listarAtividades() : listarAtividadesPorStatus(statusId);

const ListScreen = ({ navigation }) => {
  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [statusDisponiveis, setStatusDisponiveis] = useState([]);
  const [filtroAtivo, setFiltroAtivo] = useState(null);
  const statusDisponiveisRef = useRef([]);
  const filtroAtivoRef = useRef(null);
  const filtroAnteriorRef = useRef(filtroAtivo);
  const telaAtivaRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      telaAtivaRef.current = true;
      setCarregando(true);

      const carregarDadosIniciais = async () => {
        try {
          await inicializarBanco();

          if (statusDisponiveisRef.current.length === 0) {
            const statusCarregados = await listarStatus();
            if (!ativo) return;
            statusDisponiveisRef.current = statusCarregados;
            setStatusDisponiveis(statusCarregados);
          }

          const lista = await carregarListaPorFiltro(filtroAtivoRef.current);
          if (ativo) {
            setAtividades(lista);
            setCarregando(false);
          }
        } catch (error) {
          if (ativo) {
            setCarregando(false);
            Alert.alert('Erro', 'Não foi possível carregar as atividades.');
          }
        }
      };

      carregarDadosIniciais();
      return () => {
        ativo = false;
        telaAtivaRef.current = false;
      };
    }, [])
  );

  useEffect(() => {
    filtroAtivoRef.current = filtroAtivo;
    if (filtroAnteriorRef.current === filtroAtivo) return;
    filtroAnteriorRef.current = filtroAtivo;
    if (!telaAtivaRef.current) return;

    let ativo = true;
    setCarregando(true);

    carregarListaPorFiltro(filtroAtivo)
      .then((lista) => {
        if (ativo && telaAtivaRef.current) {
          setAtividades(lista);
          setCarregando(false);
        }
      })
      .catch((error) => {
        if (ativo && telaAtivaRef.current) {
          setCarregando(false);
          Alert.alert('Erro', 'Não foi possível filtrar as atividades.');
        }
      });

    return () => {
        ativo = false;
    };
  }, [filtroAtivo]);

  const handleNavigateToDetail = (atividade) => {
    navigation.navigate('Detalhe', { id: atividade.id });
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
              await excluirAtividade(atividade.id);
              const listaAtualizada = await carregarListaPorFiltro(filtroAtivoRef.current);
              if (telaAtivaRef.current) setAtividades(listaAtualizada);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a atividade.');
            }
          },
        },
      ]
    );
  };

  const meses = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  const formatarDataParaExibir = (data) => {
    if (!data) return 'Sem prazo';

  const dataObj = new Date(data);
    if (Number.isNaN(dataObj.getTime())) return data;

  const dia = dataObj.getDate();
  const mes = meses[dataObj.getMonth()];

  return `Até ${dia} de ${mes}`;
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
              { backgroundColor: item.status_cor || CORES.statusFallback },
            ]}
          >
            <Text style={styles.statusText}>{item.status_nome}</Text>
          </View>
        </View>

        <Text style={styles.subjectText}>{item.materia}</Text>

        <View style={styles.footerSection}>
          <Text style={styles.deadlineText}>📆 {formatarDataParaExibir(item.prazo)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={CORES.primaria} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filtroAtivo === null && [styles.filterButtonSelected, { backgroundColor: CORES.primaria, borderColor: CORES.primaria }],
          ]}
          onPress={() => setFiltroAtivo(null)}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterButtonText, filtroAtivo === null && styles.filterButtonTextSelected]}>
            Todos
          </Text>
        </TouchableOpacity>

        {statusDisponiveis.map((status) => {
          const selecionado = filtroAtivo === status.id;

          return (
            <TouchableOpacity
              key={status.id}
              style={[
                styles.filterButton,
                selecionado && [
                  styles.filterButtonSelected,
                  { backgroundColor: status.cor, borderColor: status.cor },
                ],
              ]}
              onPress={() => setFiltroAtivo(status.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterButtonText, selecionado && styles.filterButtonTextSelected]}>
                {status.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={atividades}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderActivityItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {filtroAtivo === null
                ? 'Nenhuma atividade cadastrada.'
                : 'Nenhuma atividade com esse status.'}
            </Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: CORES.cartao,
    borderColor: CORES.borda,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: 8,
    marginRight: 8,
    minHeight: 36,
    paddingHorizontal: 14,
  },
  filterButtonSelected: {
    borderWidth: 1,
  },
  filterButtonText: {
    color: CORES.textoTerciario,
    fontSize: 13,
    fontWeight: '600',
  },
  filterButtonTextSelected: {
    color: CORES.textoBranco,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: CORES.textoSecundario,
    fontSize: 14,
  },
  cardContainer: {
    backgroundColor: CORES.cartao,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: CORES.sombra,
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
    color: CORES.texto,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: CORES.textoBranco,
    fontSize: 12,
    fontWeight: '600',
  },
  subjectText: {
    fontSize: 14,
    color: CORES.textoSecundario,
    marginBottom: 12,
  },
  footerSection: {
    borderTopWidth: 1,
    borderTopColor: CORES.bordaSuave,
    paddingTop: 12,
  },
  deadlineText: {
    fontSize: 13,
    color: CORES.textoSuave,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: CORES.primaria,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: CORES.sombra,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: CORES.textoBranco,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ListScreen;