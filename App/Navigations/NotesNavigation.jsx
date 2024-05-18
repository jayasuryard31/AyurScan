import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import MyNotes from '../Screens/MyNotes';
import NotesDetails from '../Screens/NotesDetails';
import NotesDisplay from '../Screens/NotesDisplay';
import EditPlant from '../Screens/EditPlant';

const Stack = createStackNavigator();
export default function NotesNavigation({ route }) {
  const { showTitle } = route.params; // Access the prop to show the title
  return (
    <Stack.Navigator>
        <Stack.Screen 
          name='Notes' 
          component={MyNotes}
          options={{
            headerShown:false
          }}
        />
        <Stack.Screen 
          name='NotesDisplay' 
          component={NotesDisplay}
          options={{
            headerShown:false
          }}
        />
        <Stack.Screen 
          name='NoteDetail' 
          component={NotesDetails}
          options={({ route }) => ({
            title: showTitle ? route.params.plantname.replace(/\b\w/g, c => c.toUpperCase()) : "", // Conditionally render the title
            headerStyle:{
              backgroundColor:'#00CC99'
            },
            headerTintColor:"#fff",
            headerShown:false
          })}
        />
    </Stack.Navigator>
  )
}
