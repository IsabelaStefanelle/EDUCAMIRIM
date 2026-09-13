import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const STORAGE_KEY = '@atividades';
const STATUS_OPTIONS = ['Pendente', 'Em andamento', 'Concluído'];

const AddActivityScreen = ({ navigation }) => {
  const [titulo, setTitulo] = useState('');
  const [materia, setMateria] = useState('');
  const [prazo, setPrazo] = useState('');
  const [status, setStatus] = useState('Pendente');
  const [errorMessage, setErrorMessage] = useState('');

  const handleTitleChange = (value) => {
    setTitulo(value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSave = async () => {
    const tituloValidado = titulo.trim();

    if (!tituloValidado) {
      setErrorMessage('O campo Título é obrigatório.');
      return;
    }

    setErrorMessage('');

    const novaAtividade = {
      id: Date.now(),
      titulo: tituloValidado,
      materia: materia.trim(),
      prazo: prazo.trim(),
      status,
    };

    try {
      const atividadesSalvas = await AsyncStorage.getItem(STORAGE_KEY);
      const atividadesExistentes = atividadesSalvas ? JSON.parse(atividadesSalvas) : [];
      const listaAtualizada = Array.isArray(atividadesExistentes)
        ? [...atividadesExistentes, novaAtividade]
        : [novaAtividade];

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));

      Alert.alert(
        'Sucesso',
        'Atividade cadastrada com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
        {
          onDismiss: () => navigation.goBack(),
        }
      );
    } catch (error) {
      console.log('Erro ao salvar atividade:', error);
      Alert.alert('Erro', 'Não foi possível salvar a atividade.');
    }
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={[styles.input, errorMessage ? styles.inputError : null]}
          placeholder="Ex.: Combinatória na Geometria"
          value={titulo}
          onChangeText={handleTitleChange}
          autoCapitalize="sentences"
        />
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <Text style={styles.label}>Matéria</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Matemática"
          value={materia}
          onChangeText={setMateria}
          autoCapitalize="sentences"
        />

        <Text style={styles.label}>Prazo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: 17-06-2026"
          value={prazo}
          onChangeText={setPrazo}
          keyboardType="default"
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusRow}>
          {STATUS_OPTIONS.map((option) => {
            const isSelected = option === status;

            return (
              <TouchableOpacity
                key={option}
                style={[styles.statusButton, isSelected && styles.selectedStatus]}
                onPress={() => setStatus(option)}
                activeOpacity={0.8}
              >
                <Text style={[styles.statusButtonText, isSelected && styles.selectedStatusText]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 3,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    color: '#333333',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D9D9',
    borderRadius: 8,
    borderWidth: 1,
    color: '#333333',
    fontSize: 15,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statusButton: {
    alignItems: 'center',
    borderColor: '#D9D9D9',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
    minHeight: 48,
    paddingHorizontal: 4,
  },
  selectedStatus: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  statusButtonText: {
    color: '#555555',
    fontSize: 12,
    textAlign: 'center',
  },
  selectedStatusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 14,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    alignItems: 'center',
    borderColor: '#A9A9A9',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 12,
    paddingVertical: 13,
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddActivityScreen;