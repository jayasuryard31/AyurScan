import { View, Text, Image, TouchableOpacity, Share } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler';

export default function PlantDetail() {
    const { params } = useRoute();
    const [plant, setPlant] = useState(null);

    useEffect(() => {
        if (params && params.plant) {
            setPlant(params.plant);
            console.log(plant)
        }
    }, [params]);

    const handleShare = () => {
        if (plant) {
            const shareContent = `*Local Name:* ${plant.LocalName}\n\n*Botanical Name:* ${plant.BotanicalName}\n\n*Family:* ${plant.Family}\n\n*Folk History:*\n${plant.FolkHistory}\n\n*Parts Used:* ${plant.PartsUsed}\n\n*Medicinal Values:*\n${plant.MedicinalValue}\n\n*Type of Plant:* ${plant.TypeOfPlant}\n\n*Conservation Type:* ${plant.ConservationType}\n\n----------------------------------------------------\n----------------------------------------------------\n*Thank You For Sharing, Keep Learning!!!*`;
            Share.share({
                message: shareContent,
            });
        }
    };

    return (
        <ScrollView className="border-[1px] m-2 p-3">
            <Image
                source={{ uri: plant?.image }}
                className="h-[320px] w-[375px] rounded-t-lg"
            />
            <View className="mb-5 p-1 mt-2">
                <Text className="text-[24px] font-bold">{plant?.LocalName}</Text>
                <Text className="text-[20px] text-gray-500">{plant?.BotanicalName}</Text>
                <View className="flex-1 flex-row">
                    <Text className="text-[18px] mt-3 font-bold">Family:</Text>
                    <Text className="text-[18px] mt-3 text-justify">  {plant?.Family}</Text>
                </View>

                <Text className="text-[18px] mt-3 font-bold">Folk History:</Text>
                <Text className="text-[18px] text-justify">{plant?.FolkHistory}</Text>

                <View className="flex-1 flex-row">
                    <Text className="text-[18px] mt-3 font-bold">Parts Used:</Text>
                    <Text className="text-[18px] mt-3 text-justify">  {plant?.PartsUsed}</Text>
                </View>

                <Text className="text-[18px] mt-3 font-bold">Medicinal Values:</Text>
                <Text className="text-[18px] text-justify">{plant?.MedicinalValue}</Text>

                <View className="flex-1 flex-row">
                    <Text className="text-[18px] mt-3 font-bold">Type of plant:</Text>
                    <Text className="text-[18px] mt-3 text-justify">  {plant?.TypeOfPlant}</Text>
                </View>

                <View className="flex-1 flex-row">
                    <Text className="text-[18px] mt-3 font-bold">Conservation Type:</Text>
                    <Text className="text-[18px] mt-3 text-justify">  {plant?.ConservationType}</Text>
                </View>

                <TouchableOpacity
                    onPress={handleShare}
                    className="p-1 rounded-full border-[1px] flex-1 mt-5 bg-green-500"
                >
                    <Text className="text-center text-white text-[19px]">Share</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}
