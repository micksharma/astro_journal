import React from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar, LogBox} from 'react-native';
import {store} from './src/store/index';
import HomeScreen from './src/screens/HomeScreen';
import JournalScreen from './src/screens/JournalScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import {COLORS} from './src/utils/constants';
import { View } from 'react-native';
// Ignore specific warnings for demo
LogBox.ignoreLogs(['new NativeEventEmitter']);

const Stack = createNativeStackNavigator();


export default function App() {
  console.log('App started');
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            headerTintColor: COLORS.white,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
            animation: 'slide_from_right',
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: '🌟 Astro Journal',
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="Journal"
            component={JournalScreen}
            options={{
              title: '📝 Daily Journal',
              headerBackTitle: 'Home',
            }}
          />
          <Stack.Screen
            name="History"
            component={HistoryScreen}
            options={{
              title: '📖 Journal History',
              headerBackTitle: 'Home',
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              title: '⚙️ Settings',
              headerBackTitle: 'Home',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}