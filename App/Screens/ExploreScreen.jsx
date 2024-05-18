import { View, Text, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getFirestore, orderBy, query, getDocs } from 'firebase/firestore'; // Import missing functions
import { app } from '../../firebaseConfig';
import ItemList from '../Components/ItemList';

export default function ExploreScreen() {
  const db = getFirestore(app);
  const [productList,setProductList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = async () => {
    try {
      setProductList([])
      const q = query(collection(db, 'Plant Data'), orderBy("LocalName", "asc"));
      const snapshot = await getDocs(q);
      const products = [];
      snapshot.forEach((doc) => {
        products.push(doc.data());
      });
      setProductList(products);
    } catch (error) {
      console.error('Error fetching documents: ', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getAllProducts();
    setRefreshing(false);
  };

  return (
    <ScrollView className="p-3 py-8 mt-4"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <View>
        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Explore More</Text>
        <ItemList itemList={productList}/>
      </View>
    </ScrollView>
  );
}
