import { View, Text, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../Components/Homescreen/Header';
import GetStarted from '../Components/Homescreen/GetStarted';
import { getFirestore, collection, getDocs, orderBy } from "firebase/firestore";
import { app } from '../../firebaseConfig';
import Conservation from '../Components/Homescreen/Conservation';

export default function HomeScreen() {
  const db = getFirestore(app);
  const [conservationList, setConservationList] = useState([]);
  const [sliderList, setSliderList] = useState([]);
  const [plantsuggetion,setplantsuggetion] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getSliders();
    getConservationList();
    getplantsuggetion();
  }, []);

  const getSliders = async () => {
    setSliderList([]);
    const querySnapshot = await getDocs(collection(db, "slider"));
    querySnapshot.forEach((doc) => {
      setSliderList(sliderList => [...sliderList, doc.data()]);
    });
  }

  const getConservationList = async () => {
    setConservationList([]);
    const querySnapshot = await getDocs(collection(db, 'Conservation'));
    querySnapshot.forEach((doc) => {
      setConservationList(conservationList => [...conservationList, doc.data()]);
    });
  }

  const getplantsuggetion = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Plant Data'));
      const plantData = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data && data.LocalName) {
          plantData.push(data);
        }
      });
  
      // Set the plant data in the state
      setplantsuggetion(plantData);
    } catch (error) {
      console.error('Error fetching plant data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getSliders();
    await getConservationList();
    await getplantsuggetion();
    setRefreshing(false);
  };

  return (
      <ScrollView className="py-12 px-6 bg-green-50 flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Header plantsuggetion={plantsuggetion} searchString={searchString} setSearchString={setSearchString} />
        <GetStarted sliderList={sliderList} />
        <Conservation conservationList={conservationList} />
      </ScrollView>
  );
}
