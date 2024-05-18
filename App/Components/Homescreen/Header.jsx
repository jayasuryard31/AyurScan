import { View, Text, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import {useUser} from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';


export default function Header({ plantsuggetion, searchString, setSearchString }) {
    const {user} = useUser();
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
      const filtered = plantsuggetion.filter(suggestion =>
        suggestion.LocalName.toLowerCase().includes(searchString.toLowerCase()) ||
        suggestion.BotanicalName.toLowerCase().includes(searchString.toLowerCase()) ||
        suggestion.ConservationType.toLowerCase().includes(searchString.toLowerCase()) ||
        suggestion.TypeOfPlant.toLowerCase().includes(searchString.toLowerCase()) 
        
      );
      setFilteredSuggestions(filtered);
    }, [plantsuggetion, searchString]);

    const navigateToPlantDetail = (plant) => {
      navigation.navigate('PlantDetail', { plant });
  };

   const clearSearchText = () => {
        setSearchString('');
        setFilteredSuggestions([]); // Clear filtered suggestions as well
    };


  return (
    <View>
      {/* user info section  */}
    <View className="flex flex-row items-center gap-4">
      <Image source={{uri:user?.imageUrl}}
        className="rounded-full w-10 h-10"
      />
      <View >
        <Text className="text-[12px] font-medium">Hello Doctor!!</Text>
        <Text className="text-[15px] font-bold">{user?.fullName}</Text>
      </View>
    </View>

    {/* search bar */}

    <View className="flex flex-row p-2 px-5 items-center bg-white mt-3 rounded-2xl border-[1px] border-green-500 ">
                <Ionicons name="search" size={24} color="gray" className="mr-2" />
                <TextInput
                    placeholder="Search"
                    className="flex-1 ml-3 text-[18px]"
                    onChangeText={setSearchString}
                    value={searchString}
                />
                {searchString.length > 0 && (
                    <TouchableOpacity onPress={clearSearchText} className="px-2">
                        <Ionicons name="close" size={20} color="gray" />
                    </TouchableOpacity>
                )}
            </View>
            {searchString && (
      // Instead of ScrollView, use FlatList for rendering filtered suggestions
      <FlatList
        data={filteredSuggestions}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.LocalName}
            className="bg-white border-green-200 border-[1px] w-[100%] rounded-md"
            onPress={() => navigateToPlantDetail(item)}
          >
            <Text className="text-[17px] p-2 text-center m-1">
              {searchString.toLowerCase().trim() === item.LocalName.toLowerCase().trim() ? item.LocalName : item.BotanicalName}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    )}
    
    </View>
  )
}