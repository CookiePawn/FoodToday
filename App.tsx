import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models';
import { Load, FindAndroid, FindIOS, Result } from '@/screens';
import useExitApp from '@/hooks/useExitApp';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  useExitApp();
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Load"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="Load" component={Load} />
        <Stack.Screen name="FindAndroid" component={FindAndroid} />
        <Stack.Screen name="FindIOS" component={FindIOS} />
        <Stack.Screen name="Result" component={Result} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;