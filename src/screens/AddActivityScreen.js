import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const STORAGE_KEY = '@atividades';
const STATUS_OPTIONS = ['Pendente', 'Em andamento', 'Concluído'];
const isWeb = Platform.OS === 'web';

const AddActivityScreen = ({ navigation }) => {
  const [titulo, setTitulo] = useState('');
  const [materia, setMateria] = useState('');
  const [prazo, setPrazo] = useState('');
  const [prazoDate, setPrazoDate] = useState(new Date());
  const [status, setStatus] = useState('Pendente');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const dateParaISO = (dataObj) => {
    return dataObj.toISOString();
  };

  const formatarDataParaExibir = (dataObj) => {
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    const hora = String(dataObj.getHours()).padStart(2, '0');
    const minuto = String(dataObj.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  };

  const parseDataPorTexto = (texto) => {
    if (!texto || texto.trim() === '') return null;

    const valor = texto.trim();
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})$/;
    const match = valor.match(regex);

    if (!match) return null;

    const [, dia, mes, ano, hora, minuto] = match;
    const data = new Date(Number(ano), Number(mes) - 1, Number(dia), Number(hora), Number(minuto));

    if (Number.isNaN(data.getTime())) return null;

    return data;
  };

  const paraDateValido = (valor) => {
    if (valor && typeof valor.getTime === 'function') {
      const t = valor.getTime();
      if (!isNaN(t)) return new Date(t);
    }
    return new Date();
  };

  const abrirSeletorDataHora = () => {
    if (Platform.OS !== 'android') {
      setShowPicker(true);
      return;
    }

    const valorInicial = paraDateValido(prazoDate);

    DateTimePickerAndroid.open({
      value: valorInicial,
      mode: 'date',
      onValueChange: (selectedDate) => {
        if (!selectedDate) return;

        const dataSelecionada = paraDateValido(selectedDate);
        const apenasData = new Date(
          dataSelecionada.getFullYear(),
          dataSelecionada.getMonth(),
          dataSelecionada.getDate()
        );

        DateTimePickerAndroid.open({
          value: apenasData,
          mode: 'time',
          is24Hour: true,
          onValueChange: (selectedTime) => {
            if (!selectedTime) return;

            const horaSelecionada = paraDateValido(selectedTime);

            const dataFinal = new Date(
              apenasData.getFullYear(),
              apenasData.getMonth(),
              apenasData.getDate(),
              horaSelecionada.getHours(),
              horaSelecionada.getMinutes()
            );

            setPrazoDate(dataFinal);
            setPrazo(formatarDataParaExibir(dataFinal));
          },
        });
      },
    });
  };

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

    const prazoFinal = isWeb
      ? (prazo ? parseDataPorTexto(prazo) : null)
      : (prazo ? prazoDate : null);

    const novaAtividade = {
      id: Date.now(),
      titulo: tituloValidado,
      materia: materia.trim(),
      prazo: prazoFinal ? dateParaISO(prazoFinal) : null,
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

        {isWeb ? (
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA HH:mm"
            value={prazo}
            onChangeText={(texto) => {
              setPrazo(texto);
              const dataSelecionada = parseDataPorTexto(texto);
              if (dataSelecionada) {
                setPrazoDate(dataSelecionada);
              }
            }}
            keyboardType="numeric"
          />
        ) : (
          <>
            <TouchableOpacity
              style={styles.input}
              onPress={abrirSeletorDataHora}
              activeOpacity={0.8}
            >
              <Text style={{ color: prazo ? '#333333' : '#999999', fontSize: 15 }}>
                {prazo ? prazo : 'Selecionar data e hora'}
              </Text>
            </TouchableOpacity>

            {showPicker && Platform.OS === 'ios' && (
              <DateTimePicker
                value={prazoDate}
                mode="datetime"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowPicker(false);
                  if (selectedDate) {
                    setPrazoDate(selectedDate);
                    setPrazo(formatarDataParaExibir(selectedDate));
                  }
                }}
              />
            )}
          </>
        )}

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
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 48,
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