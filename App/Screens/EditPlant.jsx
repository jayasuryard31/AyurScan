import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@clerk/clerk-expo';

export default function EditPlant() {
    const { params } = useRoute();
    const [image, setImage] = useState(params.plant.image);
    const [LocalName, setLocalName] = useState(params.plant.LocalName);
    const [BotanicalName, setBotanicalName] = useState(params.plant.BotanicalName);
    const [desc, setDesc] = useState(params.plant.desc);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const db = getFirestore();
    const storage = getStorage();

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
        const resp = await fetch(image);
        const blob = await resp.blob();
        const storageRef = ref(storage, 'Note/' + Date.now() + '.jpg');

        uploadBytes(storageRef, blob).then(() => {
            getDownloadURL(storageRef).then(async (downloadUrl) => {
                const plantRef = doc(db, 'UserPost', params.plant.id);
                await updateDoc(plantRef, {
                    image: downloadUrl,
                    LocalName: LocalName,
                    BotanicalName: BotanicalName,
                    desc: desc,
                    userName: user.fullName,
                    userEmail: user.primaryEmailAddress.emailAddress,
                    userImage: user.imageUrl,
                    createdAt: Date.now()
                });
                setLoading(false);
                Alert.alert('Success!!!', 'Plant details updated successfully.');
            });
        });
    };

    return (
        <KeyboardAvoidingView className="bg-green-50">
            <ScrollView className="p-10">
                <Text style={{ fontSize: 28, fontWeight: 'bold' }}>Edit Plant</Text>
                <Text style={{ fontSize: 18, color: '#888', marginBottom: 10 }}>Update plant details</Text>

                <TouchableOpacity onPress={pickImage}>
                    {image ? <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 15 }} /> :
                        <Image source={require('./../Images/placeholder.jpg')} style={{ width: 100, height: 100, borderRadius: 15 }} />}
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
                <TouchableOpacity onPress={onSubmitMethod}
                    style={{
                        backgroundColor: loading ? '#ccc' : '#03A57D',
                    }}
                    disabled={loading}
                    className="p-5 bg-blue-500 rounded-full mt-10">
                    {loading ? <ActivityIndicator color='#fff' /> :
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Submit</Text>}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 17,
        textAlignVertical: 'top',
        marginTop: 20
    },
    descinput: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 20,
        paddingHorizontal: 17,
        marginTop: 20,
        textAlignVertical: 'top'
    }
});
