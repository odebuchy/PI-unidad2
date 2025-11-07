import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Post from '../screens/Post';

const Tab = createBottomTabNavigator();

function Nav() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={Home}
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

export default Nav;
