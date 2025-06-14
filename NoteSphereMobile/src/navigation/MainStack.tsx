import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/theme';

import HomeScreen from '../screens/HomeScreen';
import NoteScreen from '../screens/NoteScreen';
import { RepositoriesScreen } from '../screens/RepositoriesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileStackScreen from '../screens/ProfileStackScreen';
import RepositoryDetailScreen from '../screens/RepositoryDetailScreen';
import CollaboratorsScreen from '../screens/CollaboratorsScreen';
import { SearchScreen } from '../screens/SearchScreen';
import AddNoteScreen from '../screens/AddNoteScreen';

import { MainStackParamList, MainTabsParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AddNote"
        component={AddNoteScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-box" size={size} color={color} />
          ),
          tabBarLabel: 'Add Note',
        }}
      />
      <Tab.Screen
        name="Repositories"
        component={RepositoriesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="folder" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Note" component={NoteScreen} />
      <Stack.Screen name="Repository" component={RepositoryDetailScreen} />
      <Stack.Screen name="Collaborators" component={CollaboratorsScreen} />
      <Stack.Screen name="Profile" component={ProfileStackScreen} />
      <Stack.Screen name="AddNote" component={AddNoteScreen} />
    </Stack.Navigator>
  );
}; 