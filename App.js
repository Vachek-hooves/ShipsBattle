import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AppContextProvider } from './store/context';
import WelcomeScreen from './screen/Stack/StackWelcomeScreen';
import { TabHarborScreen, TabQuizScreen, TabShipsBattle, TabStatistickScreen } from './screen/Tab';
import { StackQuizScreen } from './screen/Stack';
import { StackShipsBattle } from './screen/Stack';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 1000,
      }}
    >
      <Tab.Screen name="TabQuizScreen" component={TabQuizScreen} />
      <Tab.Screen name="TabHarborScreen" component={TabHarborScreen} />
      <Tab.Screen name="TabShipsBattle" component={TabShipsBattle} />
      <Tab.Screen name="TabStatistickScreen" component={TabStatistickScreen} />
    </Tab.Navigator>
  );
};

function App() {
  return (
    <AppContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 1000,
          }}
        >
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="StackQuizScreen" component={StackQuizScreen} />
          <Stack.Screen name="StackShipsBattle" component={StackShipsBattle} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContextProvider>
  );
}

export default App;
