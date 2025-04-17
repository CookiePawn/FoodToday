// App.tsx (기존 CirclePulse 대신 간단한 예시)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { Load, FindAndroid, FindIOS } from '@/screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Load"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Load" component={Load} />
        <Stack.Screen name="FindAndroid" component={FindAndroid} />
        <Stack.Screen name="FindIOS" component={FindIOS} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;