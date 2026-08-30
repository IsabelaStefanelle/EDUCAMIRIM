//Aqui gatinhas o App.js é o ponto de entrada do aplicativo. Ele define a navegação entre telas e o tema geral do app.
//Comecei importando as bibliotecas necessárias para a navegação e as telas que vamos usar.
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ListScreen from './src/screens/ListScreen';
import DetailScreen from './src/screens/DetailScreen';  

//Agora criei o Stack Navigator, que é o componente que vai gerenciar a ordem em que nossas telas aparecem e como podemos navegar entre elas.
const Stack = createStackNavigator();

//Aqui definimos o componente principal do aplicativo, chamado App. Ele retorna o NavigationContainer, que é o contêiner que mantém o estado da navegação e lida com a lógica de navegação.
const App = () => { 

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Lista">
                <Stack.Screen           
                    name="Lista"
                    component={ListScreen}
                    options={{ title: 'Lista de Atividades' }}  
                />
                <Stack.Screen
                    name="Detalhe"
                    component={DetailScreen}
                    options={{ title: 'Detalhes da Atividade' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}       

export default App;






    