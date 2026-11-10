import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CORES } from '../data/theme';

const AULAS = [
  { horario: '18:10 - 19:00', materia: 'Português', professor: 'Prof. Rafaela' },
  { horario: '19:00 - 19:50', materia: 'História', professor: 'Prof. Cristiano' },
  { horario: '19:50 - 20:40', materia: 'Matemática', professor: 'Cancelada · Prof. Cristiano' },
];

export default function AvisosScreen() {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 720);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { width: contentWidth }]}>
        <View style={styles.demoLabel}>
          <Text style={styles.demoLabelText}>CONTEÚDO DE DEMONSTRAÇÃO</Text>
        </View>

        <View style={styles.alertCard}>
          <Text style={styles.alertTitle}>Aviso sobre a aula</Text>
          <Text style={styles.alertText}>
            Exemplo fictício: a aula de Matemática das 19h50 com Cristiano está cancelada hoje.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Grade de aulas · Hoje</Text>

        {AULAS.map((aula) => {
          const cancelada = aula.professor.includes('Cancelada');
          return (
            <View
              key={aula.horario}
              style={[styles.aulaCard, cancelada && styles.aulaCancelada]}
            >
              <Text style={styles.horario}>{aula.horario}</Text>
              <View style={styles.aulaInfo}>
                <Text style={styles.materia}>{aula.materia}</Text>
                <Text style={[styles.professor, cancelada && styles.textoCancelado]}>
                  {aula.professor}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  content: {
    alignSelf: 'center',
    padding: 16,
  },
  demoLabel: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3E0',
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  demoLabelText: {
    color: '#9A4D00',
    fontSize: 11,
    fontWeight: '700',
  },
  alertCard: {
    backgroundColor: '#FFEBEE',
    borderLeftColor: CORES.erro,
    borderLeftWidth: 5,
    borderRadius: 8,
    marginBottom: 24,
    padding: 16,
  },
  alertTitle: {
    color: CORES.erro,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertText: {
    color: '#8E2424',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    color: CORES.texto,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  aulaCard: {
    alignItems: 'center',
    backgroundColor: CORES.cartao,
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 8,
    minHeight: 76,
    padding: 14,
  },
  aulaCancelada: {
    backgroundColor: '#F1F1F1',
  },
  horario: {
    color: CORES.textoSecundario,
    fontSize: 12,
    fontWeight: 'bold',
    width: 104,
  },
  aulaInfo: {
    flex: 1,
  },
  materia: {
    color: CORES.texto,
    fontSize: 15,
    fontWeight: 'bold',
  },
  professor: {
    color: CORES.textoSecundario,
    fontSize: 12,
    marginTop: 3,
  },
  textoCancelado: {
    color: CORES.erro,
  },
});