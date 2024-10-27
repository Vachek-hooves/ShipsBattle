import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AppContextProvider } from './store/context';
import { View, StyleSheet, Platform, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import WelcomeScreen from './screen/Stack/StackWelcomeScreen';
import {
  TabHarborScreen,
  TabQuizScreen,
  TabShipsBattle,
  TabStatistickScreen,
} from './screen/Tab';
import {
  StackAdmiralScreen,
  StackBattleDetail,
  StackBattleScreen,
  StackQuizScreen,
  StackShipsBattle,
} from './screen/Stack';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: 'fade',
        animationDuration: 1000,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.95)']}
            style={styles.tabBarGradient}
          />
        ),
        tabBarIcon: ({ focused }) => {
          let iconSource;

          if (route.name === 'TabQuizScreen') {
            iconSource = require('./assets/icons/book.png');
          } else if (route.name === 'TabHarborScreen') {
            iconSource = require('./assets/icons/boat.png');
          } else if (route.name === 'TabShipsBattle') {
            iconSource = require('./assets/icons/game-controller.png');
          } else if (route.name === 'TabStatistickScreen') {
            iconSource = require('./assets/icons/history.png');
          }

          return (
            <Image
              source={iconSource}
              style={[
                styles.tabIcon,
                { tintColor: focused ? '#4ECDC4' : '#95A5A6' },
              ]}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#4ECDC4',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      })}
    >
      <Tab.Screen
        name="TabQuizScreen"
        component={TabQuizScreen}
        options={{ tabBarLabel: 'Quiz' }}
      />
      <Tab.Screen
        name="TabHarborScreen"
        component={TabHarborScreen}
        options={{ tabBarLabel: 'Harbor' }}
      />
      <Tab.Screen
        name="TabShipsBattle"
        component={TabShipsBattle}
        options={{ tabBarLabel: 'Battle' }}
      />
      <Tab.Screen
        name="TabStatistickScreen"
        component={TabStatistickScreen}
        options={{ tabBarLabel: 'History' }}
      />
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
          <Stack.Screen
            name="StackAdmiralScreen"
            component={StackAdmiralScreen}
          />
          <Stack.Screen
            name="StackBattleDetail"
            component={StackBattleDetail}
          />
          <Stack.Screen name='StackBattleScreen' component={StackBattleScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </AppContextProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 10,
    right: 10,
    height: 85,
    borderRadius: 15,
    backgroundColor: 'transparent',
    elevation: 0,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    paddingBottom: 10,
  },
  tabBarGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 15,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    // paddingBottom: 5,
    marginTop: 15,
  },
  tabBarItem: {
    paddingTop: 10,
  },
  tabIcon: {
    width: 44,
    height: 45,
    // marginTop: 2,
    marginTop: 12,
  },
});

export default App;
