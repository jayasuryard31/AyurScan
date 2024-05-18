import { View, Text,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from '../../hooks/useWarmUpBrowser';
WebBrowser.maybeCompleteAuthSession();
export default function LogInScreen() {
    useWarmUpBrowser();
 
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const onPress = React.useCallback(async () => {
        try {
          const { createdSessionId, signIn, signUp, setActive } =
            await startOAuthFlow();
     
          if (createdSessionId) {
            setActive({ session: createdSessionId });
          } else {
            // Use signIn or signUp for next steps such as MFA
          }
        } catch (err) {
          console.error("OAuth error", err);
        }
      }, []);
  return (
    <View>
      <Image source={require('./../Images/img1.jpg')}
        className="w-full h-[400px] object-cover"
      />

      <View className="p-10 items-center bg-white mt-[-20px] rounded-t-3xl shadow-md">
            <Text className="text-[30px] font-bold justify-center">AyurScan</Text>
            <Text className="mt-5 text-slate-500 text-[13px] text-center">Scan leaves and get informations of the plant and its benefits</Text>
            <TouchableOpacity onPress={onPress} className="p-4 pr-24 pl-24 bg-blue-500 rounded-full mt-20">
                <Text className="text-white text-center text-[18px]">Get Started</Text>
            </TouchableOpacity>
      </View>
    </View>
  )
}