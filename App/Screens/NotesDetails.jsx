import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Share, TextInput, KeyboardAvoidingView, ScrollView, ActivityIndicator, StyleSheet, Modal, Alert, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@clerk/clerk-expo';
import { getFirestore, doc, updateDoc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function NotesDetails() {
    const { params } = useRoute();
    const navigation = useNavigation();
    const [plant, setPlant] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [LocalName, setLocalName] = useState('');
    const [BotanicalName, setBotanicalName] = useState('');
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useUser();
    const db = getFirestore();
    const storage = getStorage();

    useEffect(() => {
        if (params && params.plant) {
            const { image, LocalName, BotanicalName, desc } = params.plant;
            setPlant(params.plant);
            setImage(image);
            setLocalName(LocalName);
            setBotanicalName(BotanicalName);
            setDesc(desc);
        }
    }, [params]);

    const handleShare = () => {
        if (plant) {
            const shareContent = `*Local Name:* ${plant.LocalName}\n\n*Botanical Name:* ${plant.BotanicalName}\n\n*Description:* ${plant?.desc}\n\n----------------------------------------------------\n----------------------------------------------------\n*Thank You For Sharing, Keep Learning!!!*`;
            Share.share({
                message: shareContent,
            });
        }
    };

    const handleEdit = () => {
        setEditModalVisible(true);
    };

    const handleCloseEditModal = () => {
        setEditModalVisible(false);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.assets[0].uri);
        }
    };

    const onSubmitMethod = async () => {
        setLoading(true);
    
        try {
            // Query to fetch the plant details from the 'UserPost' collection
            const q = query(collection(db, 'UserPost'), where('LocalName', '==', LocalName));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                querySnapshot.forEach(docSnapshot => {
                    // Print the plant details in the console
                    console.log('Plant details:', docSnapshot.data());
    
                    // Upload the new image
                    const uploadImage = async () => {
                        const resp = await fetch(image);
                        const blob = await resp.blob();
                        const storageRef = ref(storage, 'Note/' + Date.now() + '.jpg');
                        await uploadBytes(storageRef, blob);
                        const downloadUrl = await getDownloadURL(storageRef);
    
                        // Update the plant details
                        await updateDoc(doc(db, 'UserPost', docSnapshot.id), {
                            image: downloadUrl,
                            LocalName: LocalName,
                            BotanicalName: BotanicalName,
                            desc: desc,
                            userName: user.fullName,
                            userEmail: user.primaryEmailAddress.emailAddress,
                            userImage: user.imageUrl,
                            createdAt: Date.now()
                        });
                    };
    
                    uploadImage().then(() => {
                        setLoading(false);
                        Alert.alert('Success!!!', 'Plant details updated successfully.');
                    });
                });
            } else {
                setLoading(false);
                Alert.alert('Error', 'No plant found with the given LocalName.');
            }
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'Something went wrong while updating the plant details.');
            console.error(error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        // Here you can fetch the latest data from Firebase
        // For example:
        // const latestData = await fetchDataFromFirebase();
        // setPlant(latestData);
        setRefreshing(false);
    };

    return (
        <ScrollView
            
            className="m-2 border-[1px] p-2"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <Image
                source={{ uri: plant?.image }}
                style={{ height: 320, width: 355}}
                className="rounded-lg"
            />
            <View style={{ marginBottom: 5, padding: 1, marginTop: 2 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{plant?.LocalName}</Text>
                <Text style={{ fontSize: 20, color: 'gray' }}>{plant?.BotanicalName}</Text>
                <Text style={{ fontSize: 18, marginTop: 3, fontWeight: 'bold' }}>Description:</Text>
                <Text style={{ fontSize: 18, textAlign: 'justify' }}>{plant?.desc}</Text>
                <TouchableOpacity
                    onPress={handleShare}
                    style={{ padding: 1, borderRadius: 15, borderWidth: 1, marginTop: 5, backgroundColor: "#1db877" }}
                >
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 19 }} className="p-1">Share</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                    <MaterialIcons name="mode-edit" size={24} color="green" />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={handleCloseEditModal}
            >
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                    <ScrollView contentContainerStyle={{ padding: 20 }} style={{ backgroundColor: 'white', borderWidth: 1, margin: 3, padding: 2, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.8, shadowRadius: 10 }}>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 3 }}>Edit Plant</Text>
                        <Text style={{ fontSize: 18, color: 'gray', marginBottom: 6 }}>Update plant details</Text>
                        <TouchableOpacity onPress={pickImage}>
                            {image ? <Image source={{ uri: image }} style={styles.image} /> :
                                <Image source={require('./../Images/placeholder.jpg')} style={{ width: 100, height: 100, borderRadius: 15, marginBottom: 20 }} />}
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            placeholder='LocalName'
                            value={LocalName}
                            onChangeText={setLocalName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='BotanicalName'
                            value={BotanicalName}
                            onChangeText={setBotanicalName}
                        />
                        <TextInput
                            style={styles.descinput}
                            placeholder='Description'
                            value={desc}
                            numberOfLines={5}
                            onChangeText={setDesc}
                        />
                        <TouchableOpacity onPress={onSubmitMethod} style={styles.submitButton}>
                            {loading ? <ActivityIndicator color='#fff' /> :
                                <Text style={styles.submitButtonText}>Submit</Text>}
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    editButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 18,
        color: '#888',
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 15,
        marginBottom: 20,
    },
    input: {
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 17,
        textAlignVertical: 'top',
        width: '80%',
        marginBottom: 20,
        borderWidth: 1,
        margin: 2,
    },
    descinput: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 20,
        paddingHorizontal: 17,
        width: '80%',
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#03A57D',
        padding: 15,
        borderRadius: 10,
        width: '80%',
        marginLeft: 8,
    },
    submitButtonText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 16,
    },
});
