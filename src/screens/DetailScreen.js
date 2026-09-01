//A tela de Detalhes é omde mostramos todas as informações de uma atividade selecionada na Lista.
//Ela recebe a atividade selecionada como parâmetro da navegação e exibe seus detalhes.
//Comecei o código importando as bibliotecas necessárias para criar a tela e estilizar os componentes.
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

//Declarei a função DetailScreen que recebe as props { route, navigation }.
//A prop route contém os parâmetros passados na navegação, e a prop navigation permite voltar para a tela anterior.
const DetailScreen = ({ route, navigation }) => {
  const { atividade } = route.params || {};

//Aqui verifica se a atividade existe usando uma condicional.  
  if (!atividade) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Nenhuma atividade foi selecionada.</Text>
      </View>
    );
  }

  //Essa parte do código é responsável por renderizar a tela de detalhes da atividade selecionada.
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Título:</Text>
        <Text style={styles.value}>{atividade.titulo}</Text>

        <Text style={styles.label}>Matéria:</Text>
        <Text style={styles.value}>{atividade.materia}</Text>

        <Text style={styles.label}>Prazo:</Text>
        <Text style={styles.value}>{atividade.prazo}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{atividade.status}</Text>
      </View>

      <TouchableOpacity //Responsável por criar o botão de voltar para a tela anterior.
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

//Aqui é o CSS. 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 12,
  },
  value: {
    fontSize: 15,
    color: '#555555',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 24,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailScreen;
