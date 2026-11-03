import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CORES } from '../data/theme';

const DIAS = [
  { nome: 'Segunda-feira', aulas: ['Matemática', 'Português', 'História'] },
  { nome: 'Terça-feira', aulas: ['Física', 'Biologia', 'Educação Física'] },
  { nome: 'Quarta-feira', aulas: ['Química', 'Geografia', 'Inglês'] },
];

const HORARIOS = ['08:00', '10:00', '13:30'];

export default function GradeScreen() {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 720);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { width: contentWidth }]}>
        <View style={styles.heading}>
          <View>
            <Text style={styles.title}>Grade semanal</Text>
            <Text style={styles.subtitle}>Horários de aula</Text>
          </View>
          <Text style={styles.demoTag}>DEMONSTRAÇÃO</Text>
        </View>

        {DIAS.map((dia) => (
          <View key={dia.nome} style={styles.daySection}>
            <Text style={styles.dayTitle}>{dia.nome}</Text>
            {dia.aulas.map((aula, index) => (
              <View key={`${dia.nome}-${aula}`} style={styles.lessonRow}>
                <Text style={styles.time}>{HORARIOS[index]}</Text>
                <View style={styles.lessonDivider} />
                <Text style={styles.subject}>{aula}</Text>
              </View>
            ))}
          </View>
        ))}
        <Text style={styles.disclaimer}>Grade fictícia para apresentação.</Text>
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
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: CORES.textoSecundario,
    fontSize: 13,
    marginTop: 3,
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
  daySection: {
    backgroundColor: CORES.cartao,
    borderBottomColor: CORES.borda,
    borderBottomWidth: 2,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  dayTitle: {
    color: CORES.primaria,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  lessonRow: {
    alignItems: 'center',
    borderTopColor: CORES.bordaSuave,
    borderTopWidth: 1,
    flexDirection: 'row',
    minHeight: 46,
  },
  time: {
    color: CORES.textoSecundario,
    fontSize: 13,
    fontWeight: '700',
    width: 64,
  },
  lessonDivider: {
    backgroundColor: CORES.borda,
    height: 20,
    marginRight: 12,
    width: 1,
  },
  subject: {
    color: CORES.texto,
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  disclaimer: {
    color: CORES.textoSecundario,
    fontSize: 12,
    paddingVertical: 8,
    textAlign: 'center',
  },
});