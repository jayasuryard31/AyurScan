import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../Screens/HomeScreen';
import PlantDetail from '../Screens/PlantDetail';
import ExploreScreen from '../Screens/ExploreScreen';

const Stack = createStackNavigator();
export default function ExplorerStackNav(){
  return (
    <Stack.Navigator>
      <Stack.Screen name='home' component={ExploreScreen} 
      options={{
        headerShown:false
      }}
      />
      <Stack.Screen name='PlantDetail' component={PlantDetail}
        options={({ route }) => ({title: route.params.plantname.replace(/\b\w/g, c => c.toUpperCase()),
    headerStyle:{
        backgroundColor:'#00CC99'
    },
    headerTintColor:"#fff"
    })}/>

    </Stack.Navigator>
  )
}