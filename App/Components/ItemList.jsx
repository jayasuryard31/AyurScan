import { View, Text,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { FlatList,GestureHandlerRootView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

export default function ItemList({itemList}) {
const navigation = useNavigation()
  return (
    <GestureHandlerRootView>
  
    <View className=" pt-3">
      <FlatList
        data={itemList}
        numColumns={3}
        renderItem={({ item, index }) => (
          
          <TouchableOpacity 
          onPress={()=>navigation.push('PlantDetail',{
            plantname:item?.LocalName,
            plant:item,
          }, console.log({item}))}
          className="flex-1 m-1 p-1 mt-2 mb-2 border-[1px] rounded-lg border-green-500">
            <Image source={{uri:item.image}}
            className="w-full h-[170px] mt-3 rounded-lg" />
            <View>
                    <Text className="text-[17px] font-bold mt-2 ml-2  ">{item?.LocalName.replace(/\b\w/g, c => c.toUpperCase())}</Text>
                    <Text className="text-[10px] font-bold ml-2 text-gray-500  ">{item?.BotanicalName.replace(/\b\w/g, c => c.toUpperCase())}</Text>
                    <Text className="text-[12px] text-blue-500 bg-blue-200 p-1 rounded-full mt-2 px-3 text-center">{item?.ConservationType.replace(/\b\w/g, c => c.toUpperCase())}</Text>
                    
              </View>
          </TouchableOpacity>
          
        )}
      />
    </View>
    </GestureHandlerRootView>
  )
}
