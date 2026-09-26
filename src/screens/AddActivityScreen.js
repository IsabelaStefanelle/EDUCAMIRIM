import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STATUS_OPCOES } from '../data/status';
import { adicionarAtividade } from '../data/storage';
import { CORES } from '../data/theme';

const isWeb = Platform.OS === 'web';

const AddActivityScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 640);
  const horizontalPadding = Math.min(24, Math.max(12, width * 0.05));
  const [titulo, setTitulo] = useState('');
  const [materia, setMateria] = useState('');
  const [prazo, setPrazo] = useState('');
  const [prazoDate, setPrazoDate] = useState(new Date());
  const [status, setStatus] = useState(STATUS_OPCOES[0]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const salvandoRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      setTitulo('');
      setMateria('');
      setPrazo('');
      setPrazoDate(new Date());
      setStatus(STATUS_OPCOES[0]);
      setErrorMessage('');
      setShowPicker(false);
    }, [])
  );

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
      onValueChange: (event, selectedDate) => {
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
          onValueChange: (eventTime, selectedTime) => {
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
    if (salvando || salvandoRef.current) return;

    const tituloValidado = titulo.trim();

    if (!tituloValidado) {
      setErrorMessage('O campo Título é obrigatório.');
      return;
    }

    setErrorMessage('');

    const prazoFinal = prazo ? parseDataPorTexto(prazo) : null;

    const novaAtividade = {
      id: Date.now(),
      titulo: tituloValidado,
      materia: materia.trim(),
      prazo: prazoFinal ? dateParaISO(prazoFinal) : null,
      status,
    };

    salvandoRef.current = true;
    setSalvando(true);
    try {
      await adicionarAtividade(novaAtividade);

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
    } finally {
      salvandoRef.current = false;
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={[styles.content, { width: contentWidth, paddingHorizontal: horizontalPadding }]}
          keyboardShouldPersistTaps="handled"
        >
      <View style={[styles.card, { padding: Math.min(24, Math.max(16, width * 0.055)) }]}>
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
              <Text style={{ color: prazo ? CORES.texto : CORES.textoSuave, fontSize: 15 }}>
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
          {STATUS_OPCOES.map((option) => {
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
          disabled={salvando}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>{salvando ? 'Salvando' : 'Salvar'}</Text>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    backgroundColor: CORES.fundo,
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    flexGrow: 1,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: CORES.cartao,
    borderRadius: 12,
    elevation: 3,
    shadowColor: CORES.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    color: CORES.texto,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    backgroundColor: CORES.cartao,
    borderColor: CORES.borda,
    borderRadius: 8,
    borderWidth: 1,
    color: CORES.texto,
    fontSize: 15,
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: CORES.erro,
  },
  errorText: {
    color: CORES.erro,
    fontSize: 13,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  statusButton: {
    alignItems: 'center',
    borderColor: CORES.borda,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    marginBottom: 8,
    marginRight: 8,
    minWidth: 88,
    minHeight: 48,
    paddingHorizontal: 4,
  },
  selectedStatus: {
    backgroundColor: CORES.primaria,
    borderColor: CORES.primaria,
  },
  statusButtonText: {
    color: CORES.textoTerciario,
    fontSize: 12,
    textAlign: 'center',
  },
  selectedStatusText: {
    color: CORES.textoBranco,
    fontWeight: 'bold',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: CORES.primaria,
    borderRadius: 10,
    paddingVertical: 14,
  },
  saveButtonText: {
    color: CORES.textoBranco,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    alignItems: 'center',
    borderColor: CORES.bordaNeutra,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 12,
    paddingVertical: 13,
  },
  cancelButtonText: {
    color: CORES.textoSecundario,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddActivityScreen;