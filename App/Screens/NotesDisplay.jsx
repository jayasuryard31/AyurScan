import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
export default function NotesDisplay({ displayList, onDelete }) {
  const navigation = useNavigation();

  const handleDelete = (item) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${item.LocalName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => onDelete(item),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <GestureHandlerRootView>
      <View className="p-5">
        <FlatList
          data={displayList}
          numColumns={2}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.push('NoteDetail', {
                  plantname: item?.LocalName,
                  plant: item,
                })
              }
              className="flex-1 m-2 p-2 border-[1px] rounded-lg border-green-500"
            >
              <Image source={{ uri: item.image }} className="w-full h-[170px] mt-3 rounded-lg" />
              <View>
                <Text className="text-[17px] font-bold mt-2 ml-2 ">{item?.LocalName.replace(/\b\w/g, (c) => c.toUpperCase())}</Text>
                <Text className="text-[10px] font-bold ml-2 text-gray-500 ">{item?.BotanicalName.replace(/\b\w/g, (c) => c.toUpperCase())}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.LocalName)} style={{ position: 'absolute', bottom: 10, right: 10 }}>
              <AntDesign name="delete" size={18} color="black" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </View>
    </GestureHandlerRootView>
  );
}
