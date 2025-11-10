import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Post from '../screens/Post';
import Profile from '../screens/Profile';
import Comments from '../screens/Comments';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <HomeStack.Screen name="Comments" component={Comments} options={{ title: 'Comentarios' }} />
    </HomeStack.Navigator>
  );
}

function Nav() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          tabBarIcon: function () {
            return <Entypo name="home" size={24} color={'#0288D1'} />;
          },
        }}
      />
      <Tab.Screen
        name="Post"
        component={Post}
        options={{
          tabBarIcon: function () {
            return <MaterialCommunityIcons name="plus-circle" size={28} color={'#0288D1'} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: function () {
            return <MaterialCommunityIcons name="account-circle" size={26} color={'#0288D1'} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default Nav;
