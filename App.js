import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddActivityScreen from './src/screens/AddActivityScreen';
import AvisosScreen from './src/screens/AvisosScreen';
import DetailScreen from './src/screens/DetailScreen';
import GradeScreen from './src/screens/GradeScreen';
import ListScreen from './src/screens/ListScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProjetosScreen from './src/screens/ProjetosScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'EducaMirim' }}
        />
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
        <Stack.Screen
          name="Adicionar"
          component={AddActivityScreen}
          options={({ route }) => ({
            title: route.params?.id ? 'Editar Atividade' : 'Nova Atividade',
          })}
        />
        <Stack.Screen
          name="Avisos"
          component={AvisosScreen}
          options={{ title: 'Mural de Avisos' }}
        />
        <Stack.Screen
          name="Grade"
          component={GradeScreen}
          options={{ title: 'Grade de Aulas' }}
        />
        <Stack.Screen
          name="Projetos"
          component={ProjetosScreen}
          options={{ title: 'Trabalhos em Grupo' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;






    