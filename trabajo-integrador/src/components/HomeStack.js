import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Comments from '../screens/Comments';

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <HomeStack.Screen name="Comments" component={Comments} options={{ headerShown: false }} />
    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;