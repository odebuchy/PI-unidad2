import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './src/screens/Register';
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import Nav from './src/components/Nav';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator options={{headerShown: false}}>
        
        <Stack.Screen name="Register" component={Register}  />
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Nav" component={Nav} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
