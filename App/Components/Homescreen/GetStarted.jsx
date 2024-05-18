import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function GetStarted({ sliderList }) {
  
  const navigation = useNavigation();

  const handleLeafPress = async (item) => {
    navigation.navigate('Camera', { leafImage: item.image });
  };

  return (
    <View className="mt-2">
      <FlatList
        data={sliderList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleLeafPress(item)} style={{ margin: 5 }}>
            <Image
              source={{ uri: item.image }}
              style={{ height: 200, width: 330, borderRadius: 10 }}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
