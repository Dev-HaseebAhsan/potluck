import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/screens/welcome';
import LoginScreen from './src/screens/login';
import AccountCreationScreen from './src/screens/accountCreation';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Create-Account" component={AccountCreationScreen} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}