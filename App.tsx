import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models';
import { Load, FindAndroid, FindIOS, Result, Permission, License, Privacy, Terms } from '@/screens';
import { useExitApp } from '@/hooks';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  useExitApp();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Permission"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name='Permission' component={Permission} />
        <Stack.Screen name="Load" component={Load} />
        <Stack.Screen name="FindAndroid" component={FindAndroid} />
        <Stack.Screen name="FindIOS" component={FindIOS} />
        <Stack.Screen name="Result" component={Result} />
        <Stack.Screen name="License" component={License} />
        <Stack.Screen name="Privacy" component={Privacy} />
        <Stack.Screen name="Terms" component={Terms} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;