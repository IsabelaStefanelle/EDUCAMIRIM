import { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CORES } from '../data/theme';

const PERFIS = ['Aluno', 'Professor'];

export default function LoginScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [perfil, setPerfil] = useState('Aluno');

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { width: Math.min(width - 32, 440) }]}>
        <View style={styles.card}>
          <Text style={styles.brand}>EducaMirim</Text>
          <Text style={styles.title}>Organize sua rotina escolar</Text>
          <Text style={styles.demoNotice}>Acesso demonstrativo · sem autenticação</Text>

          <Text style={styles.label}>Perfil</Text>
          <View style={styles.roleSelector}>
            {PERFIS.map((item) => {
              const selecionado = perfil === item;
              return (
                <TouchableOpacity
                  key={item}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selecionado }}
                  style={[styles.roleButton, selecionado && styles.roleButtonSelected]}
                  onPress={() => setPerfil(item)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.roleText, selecionado && styles.roleTextSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>E-mail institucional</Text>
          <TextInput
            style={styles.input}
            placeholder="voce@escola.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Senha de demonstração"
            secureTextEntry
          />

          <Text style={styles.disclaimer}>
            Os campos não são validados, enviados ou armazenados.
          </Text>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => navigation.replace('Lista')}
            accessibilityRole="button"
            activeOpacity={0.85}
          >
            <Text style={styles.submitText}>Entrar como {perfil}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
    justifyContent: 'center',
  },
  content: {
    alignSelf: 'center',
    paddingVertical: 24,
  },
  card: {
    backgroundColor: CORES.cartao,
    borderColor: CORES.bordaSuave,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 3,
    padding: 24,
    shadowColor: CORES.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  brand: {
    color: CORES.primaria,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  title: {
    color: CORES.texto,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  demoNotice: {
    alignSelf: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 4,
    color: '#8A4B08',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 24,
    marginTop: 16,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  label: {
    color: CORES.texto,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 7,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  roleButton: {
    alignItems: 'center',
    borderColor: CORES.borda,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  roleButtonSelected: {
    backgroundColor: CORES.primaria,
    borderColor: CORES.primaria,
  },
  roleText: {
    color: CORES.texto,
    fontSize: 14,
    fontWeight: '700',
  },
  roleTextSelected: {
    color: CORES.textoBranco,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderColor: CORES.borda,
    borderRadius: 8,
    borderWidth: 1,
    color: CORES.texto,
    fontSize: 15,
    marginBottom: 16,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  disclaimer: {
    color: CORES.textoSecundario,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: CORES.primaria,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 50,
    marginTop: 4,
  },
  submitText: {
    color: CORES.textoBranco,
    fontSize: 15,
    fontWeight: '700',
  },
});