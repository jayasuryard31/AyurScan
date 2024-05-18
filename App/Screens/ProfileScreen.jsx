import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo'
import explore from  '../Images/explore.png';
import logout from  '../Images/logout.png'
import note from  '../Images/note.png'
import { useNavigation } from '@react-navigation/native';
// import mynotes from '../Screens/MyNotes';
export default function ProfileScreen() {

  const {user} = useUser();
  const navigation = useNavigation();
  const { isLoaded,signOut } = useAuth();
  const menuList=[
    {
      id:1,
      name: "My Notes",
      icon: note,
      path: 'mynotes',
    },
    {
      id:2,
      name: "Maps",
      icon: explore,
      path:'mymaps'

    },
    {
      id:3,
      name: "Logout",
      icon: logout
    }
  ]

  const onMenuPress=(item)=>{
    if(item.name==="Logout"){
      signOut()
      return;
    }

      item?.path?navigation.navigate(item.path):null
  }
  return (
    <View className="p-5 bg-green-50 flex-1">
      <View className="items-center justify-center mt-14">
      <Image source={{uri:user?.imageUrl}}
      className="w-[100px] h-[100px] rounded-full"
      />
      <Text className="font-bold text-[25px] mt-2">{user?.fullName}</Text>
      <Text className="text-[18px] mt-2 text-gray-500">{user?.primaryEmailAddress?.emailAddress}</Text>
      </View>

      <FlatList
        data={menuList}
        className="mt-7"
        numColumns={2}
        renderItem={({item,index})=>(
          <TouchableOpacity 
          onPress={()=>onMenuPress(item)}
          className="flex-1 p-3 border-[1px] items-center
           mx-2 mt-4 rounded-lg border-green-400 bg-green-100">
                {item.icon && <Image source={item?.icon}
                className="w-[50px] h-[50px]"/>}
                <Text className="text-[12px] mt-2 text-green-700">{item.name}</Text>
          </TouchableOpacity>

        )}

      />
    </View>
  )
}