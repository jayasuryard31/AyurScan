import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../Screens/HomeScreen';
import ConservationItemList from '../Screens/ConservationItemList';
import PlantDetail from '../Screens/PlantDetail';
import CameraScreen from '../Screens/CameraScreen';

const Stack = createStackNavigator();
export default function HomeScreenStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='home' component={HomeScreen} 
      options={{
        headerShown:false
      }}
      />
      <Stack.Screen name='conserveitem' component={ConservationItemList}
        options={({ route }) => ({title: route.params?.conservation?.replace(/\b\w/g, c => c.toUpperCase()),
    headerStyle:{
        backgroundColor:'#00CC99'
    },
    headerTintColor:"#fff"
    })}/>

<Stack.Screen name='Camera' component={CameraScreen}
    options={{
      headerStyle:{
        backgroundColor:'#00CC99'
    },
    headerTintColor:"#fff"
    }}
    />
    

      <Stack.Screen name='PlantDetail' component={PlantDetail}
        options={({ route }) => ({title: route.params?.plantname?.replace(/\b\w/g, c => c.toUpperCase()),
    headerStyle:{
        backgroundColor:'#00CC99'
    },
    headerTintColor:"#fff"
    })}/>




    

    </Stack.Navigator>
  )
}