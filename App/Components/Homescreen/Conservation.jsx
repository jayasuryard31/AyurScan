import { View, Text,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { FlatList, GestureHandlerRootView} from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

export default function Conservation({conservationList}) {
const navigation = useNavigation();
  return (
    <GestureHandlerRootView>    
      <View className="mt-5">
      <Text className="font-bold text-[20px]">Conservation Types</Text>
      <FlatList
      data={conservationList}
      numColumns={1}
      renderItem={({item,index})=>(
        <TouchableOpacity 
        onPress={()=> navigation.navigate('conserveitem',{
          conservation:item.conservationtype
        })}
        className="flex-1 items-center justify-center p-2 border-[1px]
        border-green-300 m-1 h-[80px] rounded-lg bg-green-100
        ">
              <Image source={{uri:item.Icon}}
                  className="w-[40px] h-[40px] " 
              />

              <Text className="text-[14px] mt-1">{item.conservationtype.replace(/\b\w/g, c => c.toUpperCase())}</Text>
          </TouchableOpacity>
      )}  
      />
    </View>
    </GestureHandlerRootView>

  )
}