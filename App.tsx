// App.tsx (기존 CirclePulse 대신 간단한 예시)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import Load from '@/screens/Load';
import Find from '@/screens/find';

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
        <Stack.Screen name="Find" component={Find} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;