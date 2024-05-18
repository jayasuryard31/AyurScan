import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from '../Screens/ProfileScreen';
import MyNotes from '../Screens/MyNotes';
import NoteDetails from '../Screens/NotesDetails';
import NotesNavigation from './NotesNavigation';
import MapScreen from '../Screens/MapScreen';

const Stack = createStackNavigator();
export default function ProfileScreenStackNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name='profile-tab' 
        component={ProfileScreen} 
        options={{
          headerShown:false
        }}
      />
      <Stack.Screen 
        name='mynotes' 
        component={NotesNavigation}
        initialParams={{ showTitle: true }} // Pass the prop to show the title
        options={{
          headerStyle:{
            backgroundColor: '#00CC99',
          },
          headerTintColor: "#fff",
          headerTitle: "My Notes"
        }}
      />
      <Stack.Screen 
        name='mymaps' 
        component={MapScreen}
        initialParams={{ showTitle: true }} // Pass the prop to show the title
        options={{
          headerStyle:{
            backgroundColor: '#00CC99',
          },
          headerTintColor: "#fff",
          headerTitle: "Maps"
        }}
      />
    </Stack.Navigator>
  )
}
