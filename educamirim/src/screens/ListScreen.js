// Oiii Gatinhas! Explicando o código pra vocês:

// Importei o React e os componentes nativos do React Native que vão construir a nossa interface:
// View: funciona como a <div> (<div> = uma caixa onde podemos colocar outros elementos dentro, como texto, imagens, botões, etc.). 
// FlatList: componente do React Native para renderizar (renderizar = mostrar na tela) listas de forma leve.
// TouchableOpacity: elemento clicável que diminui a transparência ao ser tocado (nosso botão).
// StyleSheet: para criar a nossa folha de estilos (o "CSS" do React Native).
// Alert: para abrir aquela caixinha de aviso nativa do celular.
import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';

// Criei um array (array = lista) chamado "atividades" com 3 objetos estáticos (estático = não muda, apenas se mexer diretamente no código).
// Cada objeto contém: id, titulo, materia, prazo e status.
// Comecei com o Array porque ainda não temos um banco de dados e a FlatList precisa dessa lista de dados para conseguir mapear e mostrar os itens na tela.
const atividades = [
  {
    id: 1,
    titulo: "Combinatoria na Geometria",
    materia: "Matemática",
    prazo: "17-06-2026",
    status: "Pendente"
  },
  {
    id: 2,
    titulo: "Comentando Machado de Assis",
    materia: "Português",
    prazo: "01-09-2026",
    status: "Em andamento"
  },
  {
    id: 3,
    titulo: "Praticando POO",
    materia: "Desenvolvimento de Sistemas",
    prazo: "20-08-2026",
    status: "Concluído"
  }
];

// No JavaScript, criamos funções usando "const" (const = constante, ou seja, um valor que não muda) e a seta "=>" (arrow function, deixei explicado no Drive essa seta maldita).
// Essa função recebe o texto do status (ex: "Concluído") e retorna a cor em código hexadecimal (código hexadecimal = uma forma de representar cores em computação).
const getStatusColor = (status) => {
  if (status === "Concluído") {
    return "#4CAF50"; 
  } else if (status === "Em andamento") {
    return "#FF9800"; 
  } else if (status === "Pendente") {
    return "#F44336"; 
  }
  return "#757575"; 
};

// Recebe a prop { navigation } (prop { navigation } = objeto que contém métodos para navegar entre as telas, melhor explicado no Drive também) para nos permitir navegar entre as telas do aplicativo.
const ListScreen = ({ navigation }) => {

  // Função para mudar de tela ao clicar num botão.
  // Ela chama a rota 'Detalhe' e envia o objeto da atividade selecionada como parâmetro (Melhor explicada no Drive também).
  const handleNavigateToDetail = (atividade) => {
    navigation.navigate('Detalhe', { atividade });
  };

  // Função para exibir o alerta ao clicar no botão de adicionar.
  const handleAddActivity = () => {
    Alert.alert(
      "Cadastro de Atividades",
      "O cadastro de novas atividades será liberado na Fase 2 do projeto.",
      [
        {
          text: "OK",
          onPress: () => console.log("Alerta confirmado"),
        }
      ]
    );
  };

  // Essa função define o visual de UM único item da lista. A FlatList vai repeti-la para cada atividade.
  // Usamos a desestruturação { item } para acessar os dados do objeto diretamente.
  const renderActivityItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => handleNavigateToDetail(item)} // Ao clicar, envia o item atual para a tela de detalhes.
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.headerSection}>
          <Text style={styles.titleText}>{item.titulo}</Text>
          
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) }
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.subjectText}>{item.materia}</Text>

        <View style={styles.footerSection}>
          <Text style={styles.deadlineText}>📆 {item.prazo}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={atividades}
        keyExtractor={(item) => item.id.toString()} // A FlatList precisa de um ID em formato de Texto.
        renderItem={renderActivityItem}
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
    </View>
  );
};

// Onde definimos o CSS.
const styles = StyleSheet.create({
  container: {
    flex: 1, // Faz a tela ocupar todo o espaço do celular.
    backgroundColor: "#F5F5F5", // Fundo cinza claro para destacar os cards brancos.
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // Espaço extra no final da lista para o botão não cobrir o último card.
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: "hidden",
  },
  cardContent: {
    padding: 16,
  },
  headerSection: {
    flexDirection: "row", // Alinha o título e o status lado a lado.
    justifyContent: "space-between", // Empurra o título para a esquerda e a tag para a direita.
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    flex: 1, // Faz o texto do título ocupar todo o espaço disponível antes do status.
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20, // Borda bem arredondada para parecer uma etiqueta.
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  subjectText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
  },
  footerSection: {
    borderTopWidth: 1, // Linha fina divisória acima do prazo.
    borderTopColor: "#EEEEEE",
    paddingTop: 12,
  },
  deadlineText: {
    fontSize: 13,
    color: "#999999",
  },
  addButton: {
    position: "absolute", // Deixa o botão flutuando por cima da lista.
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center", // Centraliza o texto do botão horizontalmente.
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ListScreen;