import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LogInScreen from './App/Screens/LogInScreen';
import { ClerkProvider, SignedIn,SignedOut } from "@clerk/clerk-expo";
import {NavigationContainer} from "@react-navigation/native";
import TabNavigations from './App/Navigations/TabNavigations';
export default function App() {
  return (
    <ClerkProvider publishableKey='pk_test_d2VsY29tZWQtY293YmlyZC03OC5jbGVyay5hY2NvdW50cy5kZXYk'>
    <View>
      
     <StatusBar style="auto" />
    </View>
        <SignedIn>
          <NavigationContainer>
            <TabNavigations/>
          </NavigationContainer>
        </SignedIn>
        <SignedOut>
        <LogInScreen/>
        </SignedOut>


    </ClerkProvider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
