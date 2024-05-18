import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import ExploreScreen from '../Screens/ExploreScreen'; // Corrected typo in the import
import NoteScreen from '../Screens/NoteScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import { FontAwesome, Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'; // Combine imports
import ProfileScreenStackNav from './ProfileScreenStackNav';
import HomeScreenStack from './HomeScreenStack';
import ExplorerStackNav from './ExplorerStackNav';
const Tab = createBottomTabNavigator();

export default function TabNavigations() {
  return (
    <Tab.Navigator screenOptions={{
        headerShown:false,
        tabBarActiveTintColor:'#00AC81'
    }}>
      <Tab.Screen name='Home-nav' component={HomeScreenStack} 
        options={{
          tabBarLabel:({color})=>(
            <Text style={{color:color,fontSize:12,marginBottom:3}}>Home</Text>
          ),
          tabBarIcon:({color,size}) => (
            <FontAwesome name="home" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen name='Explore-nav' component={ExplorerStackNav}
        options={{
          tabBarLabel:({color})=>(
            <Text style={{color:color,fontSize:12,marginBottom:3}}>Explore</Text>
          ),
          tabBarIcon:({color,size}) => (
            <Feather name="bookmark" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen name='Note' component={NoteScreen}
        options={{
          tabBarLabel:({color})=>(
            <Text style={{color:color,fontSize:12,marginBottom:3}}>Note</Text>
          ),
          tabBarIcon:({color,size}) => (
            <MaterialCommunityIcons name="notebook" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen name='Profile-nav' component={ProfileScreenStackNav}
        options={{
          tabBarLabel:({color})=>(
            <Text style={{color:color,fontSize:12,marginBottom:3}}>Profile</Text>
          ),
          tabBarIcon:({color,size}) => (
            <Ionicons name="person-circle" size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  )
}
