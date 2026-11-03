import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CORES } from '../data/theme';

const PROJETOS = [
  {
    nome: 'Feira de Ciências: Robótica',
    materia: 'Física',
    prazo: '15/11',
    etapas: [
      { titulo: 'Pesquisa de referências', responsavel: 'João', estado: 'Concluída' },
      { titulo: 'Montagem do protótipo', responsavel: 'Maria', estado: 'Em andamento' },
      { titulo: 'Criação dos slides', responsavel: 'Você', estado: 'A fazer' },
    ],
  },
  {
    nome: 'Apresentação de Literatura',
    materia: 'Português',
    prazo: '20/11',
    etapas: [{ titulo: 'Leitura do livro', responsavel: 'Todos', estado: 'A fazer' }],
  },
];

const CORES_ETAPA = {
  Concluída: { fundo: '#E8F5E9', texto: '#2E7D32' },
  'Em andamento': { fundo: '#FFF3E0', texto: '#A65B00' },
  'A fazer': { fundo: '#F1F3F4', texto: '#5F6368' },
};

export default function ProjetosScreen() {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 720);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { width: contentWidth }]}>
        <View style={styles.heading}>
          <Text style={styles.title}>Trabalhos em grupo</Text>
          <Text style={styles.demoTag}>DEMONSTRAÇÃO</Text>
        </View>

        {PROJETOS.map((projeto) => (
          <View key={projeto.nome} style={styles.projectSection}>
            <Text style={styles.projectTitle}>{projeto.nome}</Text>
            <Text style={styles.projectMeta}>{projeto.materia} · Entrega {projeto.prazo}</Text>

            <Text style={styles.sectionLabel}>Etapas</Text>
            {projeto.etapas.map((etapa) => {
              const cores = CORES_ETAPA[etapa.estado];
              return (
                <View key={etapa.titulo} style={styles.stageRow}>
                  <View style={styles.stageCopy}>
                    <Text style={styles.stageTitle}>{etapa.titulo}</Text>
                    <Text style={styles.stageOwner}>{etapa.responsavel}</Text>
                  </View>
                  <Text style={[styles.stageState, { backgroundColor: cores.fundo, color: cores.texto }]}>
                    {etapa.estado}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
        <Text style={styles.disclaimer}>Projetos e etapas são dados fictícios.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: CORES.fundo,
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    padding: 16,
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    color: CORES.texto,
    flex: 1,
    fontSize: 21,
    fontWeight: '800',
    marginRight: 8,
  },
  demoTag: {
    backgroundColor: '#FFF3E0',
    borderRadius: 4,
    color: '#8A4B08',
    fontSize: 10,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  projectSection: {
    backgroundColor: CORES.cartao,
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
  },
  projectTitle: {
    color: CORES.texto,
    fontSize: 16,
    fontWeight: '700',
  },
  projectMeta: {
    color: CORES.textoSecundario,
    fontSize: 12,
    marginTop: 4,
  },
  sectionLabel: {
    color: CORES.texto,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 4,
  },
  stageRow: {
    alignItems: 'center',
    borderTopColor: CORES.bordaSuave,
    borderTopWidth: 1,
    flexDirection: 'row',
    minHeight: 56,
    paddingVertical: 8,
  },
  stageCopy: {
    flex: 1,
    paddingRight: 8,
  },
  stageTitle: {
    color: CORES.texto,
    fontSize: 13,
    fontWeight: '600',
  },
  stageOwner: {
    color: CORES.textoSecundario,
    fontSize: 11,
    marginTop: 3,
  },
  stageState: {
    borderRadius: 4,
    fontSize: 10,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  disclaimer: {
    color: CORES.textoSecundario,
    fontSize: 12,
    paddingVertical: 8,
    textAlign: 'center',
  },
});