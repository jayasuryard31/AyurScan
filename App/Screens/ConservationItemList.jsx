import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { collection, where, query, getFirestore, getDocs, orderBy } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import ItemList from '../Components/ItemList';

export default function ConservationItemList() {
    const {params} = useRoute();
    const db = getFirestore(app)
    const [itemList, setItemList] = useState([]);

    useEffect(()=>{
        console.log(params.conservation)
        params&&getItemListByCategory()
    },[params])

    const getItemListByCategory = async()=>{
        setItemList([])
        const q = query(
            collection(db, 'Plant Data'),
            where('ConservationType', '==', params.conservation)
        );
        const snapshot = await getDocs(q);
        snapshot.forEach(doc=>{
            // console.log(doc.data())
            setItemList(itemList=>[...itemList,doc.data()])
        })
    }
  return (
    <View>
        {itemList.length>0? 
        <ItemList itemList={itemList}/>
        :
        <Text className="p-5 text-[20px] mt-24 text-gray-500 text-center justify-center" >No Plants are there in this Category</Text>

        }
    </View>
  )
}