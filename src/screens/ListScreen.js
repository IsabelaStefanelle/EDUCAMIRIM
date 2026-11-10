import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  buscarLembreteAtividade,
  excluirAtividade,
  excluirLembreteAtividade,
  inicializarBanco,
  listarAtividades,
  listarAtividadesPorStatus,
  listarStatus,
} from '../data/database';
import { cancelarNotificacaoLocal } from '../data/notifications';
import { CORES } from '../data/theme';

const carregarListaPorFiltro = (statusId) =>
  statusId === null ? listarAtividades() : listarAtividadesPorStatus(statusId);

const contarAtividadesConcluidas = async (statusList) => {
  const statusConcluido = statusList.find((status) => status.nome === 'Concluído');
  if (!statusConcluido) return 0;
  return (await listarAtividadesPorStatus(statusConcluido.id)).length;
};

const ListScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 720);
  const horizontalPadding = Math.min(24, Math.max(12, width * 0.045));
  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [statusDisponiveis, setStatusDisponiveis] = useState([]);
  const [tarefasConcluidas, setTarefasConcluidas] = useState(0);
  const [filtroAtivo, setFiltroAtivo] = useState(null);
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

          const statusCarregados = await listarStatus();
          if (!ativo) return;
          setStatusDisponiveis(statusCarregados);
          const totalConcluidas = await contarAtividadesConcluidas(statusCarregados);
          if (!ativo) return;
          setTarefasConcluidas(totalConcluidas);

          let filtroId = filtroAtivoRef.current;
          if (filtroId !== null && !statusCarregados.some((status) => status.id === filtroId)) {
            filtroId = null;
            filtroAtivoRef.current = null;
            filtroAnteriorRef.current = null;
            setFiltroAtivo(null);
          }

          const lista = await carregarListaPorFiltro(filtroId);
          if (ativo) {
            setAtividades(lista);
            setCarregando(false);
          }
        } catch {
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
              const lembrete = await buscarLembreteAtividade(atividade.id);
              if (lembrete) {
                await cancelarNotificacaoLocal(lembrete.notificacao_id);
                await excluirLembreteAtividade(atividade.id);
              }
              await excluirAtividade(atividade.id);
              const statusAtualizados = await listarStatus();
              const [listaAtualizada, totalConcluidas] = await Promise.all([
                carregarListaPorFiltro(filtroAtivoRef.current),
                contarAtividadesConcluidas(statusAtualizados),
              ]);
              if (telaAtivaRef.current) {
                setAtividades(listaAtualizada);
                setTarefasConcluidas(totalConcluidas);
              }
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir a atividade.');
            }
          },
        },
      ]
    );
  };

  const formatarDataParaExibir = (data) => {
    if (!data) return 'Sem prazo';

    const dataObj = new Date(data);
    if (Number.isNaN(dataObj.getTime())) return data;

    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    const hora = String(dataObj.getHours()).padStart(2, '0');
    const minuto = String(dataObj.getMinutes()).padStart(2, '0');

    return `Até ${dia}/${mes}/${ano} às ${hora}:${minuto}`;
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
      <View style={[styles.filterRow, { width: contentWidth, paddingHorizontal: horizontalPadding }]}>
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

      <View style={[styles.featureLinks, { width: contentWidth - horizontalPadding * 2 }]}>
        <TouchableOpacity
          style={styles.featureLink}
          onPress={() => navigation.navigate('Avisos')}
          activeOpacity={0.8}
        >
          <Text style={styles.featureLinkText}>Avisos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.featureLink}
          onPress={() => navigation.navigate('Grade')}
          activeOpacity={0.8}
        >
          <Text style={styles.featureLinkText}>Grade</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.featureLink}
          onPress={() => navigation.navigate('Projetos')}
          activeOpacity={0.8}
        >
          <Text style={styles.featureLinkText}>Projetos</Text>
        </TouchableOpacity>
      </View>

      {(atividades.length > 0 || tarefasConcluidas > 0) && (
        <View style={[styles.gamificationBanner, { width: contentWidth - horizontalPadding * 2 }]}>
          <Text style={styles.gamificationTitle}>
            Você concluiu {tarefasConcluidas} tarefa{tarefasConcluidas === 1 ? '' : 's'}!
          </Text>
          <Text style={styles.gamificationSubtitle}>Contador baseado nas atividades salvas no app.</Text>
        </View>
      )}

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
            {filtroAtivo === null && (
              <TouchableOpacity
                style={styles.emptyAction}
                onPress={handleAddActivity}
                activeOpacity={0.8}
              >
                <Text style={styles.emptyActionText}>Adicionar atividade</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        contentContainerStyle={[styles.listContent, { width: contentWidth, paddingHorizontal: horizontalPadding, paddingBottom: 96 }]}
        scrollEnabled={true}
      />
      <TouchableOpacity
        style={[styles.addButton, { right: (width - contentWidth) / 2 + horizontalPadding }]}
        onPress={handleAddActivity}
        accessibilityRole="button"
        accessibilityLabel="Adicionar atividade"
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+</Text>
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
    alignSelf: 'center',
    paddingTop: 12,
  },
  filterRow: {
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    textAlign: 'center',
  },
  emptyAction: {
    alignItems: 'center',
    backgroundColor: CORES.primaria,
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 16,
    minHeight: 44,
    paddingHorizontal: 16,
  },
  emptyActionText: {
    color: CORES.textoBranco,
    fontSize: 14,
    fontWeight: '700',
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
    alignItems: 'center',
    backgroundColor: CORES.primaria,
    borderRadius: 30,
    bottom: 24,
    elevation: 5,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    shadowColor: CORES.sombra,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 60,
  },
  addButtonText: {
    color: CORES.textoBranco,
    fontSize: 34,
    fontWeight: '400',
    lineHeight: 38,
  },
  featureLinks: {
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  featureLink: {
    alignItems: 'center',
    backgroundColor: CORES.cartao,
    borderColor: CORES.borda,
    borderRadius: 8,
    borderWidth: 1,
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 42,
    minWidth: 88,
    paddingHorizontal: 8,
  },
  featureLinkText: {
    color: CORES.primaria,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  gamificationBanner: {
    alignSelf: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    marginTop: 12,
    padding: 16,
  },
  gamificationTitle: {
    color: '#E65100',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gamificationSubtitle: {
    color: '#9A4D00',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default ListScreen;