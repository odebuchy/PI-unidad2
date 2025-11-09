// src/components/Nav.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';

import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Post from '../screens/Post';
import Comments from '../screens/Comments'; // ← nueva screen

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeFeed"
        component={Home}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Comments"
        component={Comments}
        options={{ title: 'Comentarios' }}
      />
    </HomeStack.Navigator>
  );
}

export default function Nav() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: () => <FontAwesome name="home" size={24} color="#4FC3F7" />,
        }}
      />
      <Tab.Screen
        name="Nuevo Post"
        component={Post}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: () => <Entypo name="plus" size={24} color="#4FC3F7" />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: () => <FontAwesome name="user" size={24} color="#4FC3F7" />,
        }}
      />
    </Tab.Navigator>
  );
}
