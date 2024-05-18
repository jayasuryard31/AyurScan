import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getFirestore, query, where, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore'; // Add deleteDoc import
import { app } from '../../firebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import ItemList from '../Components/ItemList';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import NotesDisplay from './NotesDisplay';

export default function MyNotes() {
    const navigation = useNavigation();
    const db = getFirestore(app);
    const [productList, setProductList] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        user && getUserPost();
    }, [user]);

    const getUserPost = async () => {
        setProductList([]);
        const q = query(collection(db, 'UserPost'), where('userEmail', '==', user?.primaryEmailAddress?.emailAddress));
        const snapshot = await getDocs(q);
        const data = [];
        snapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });
        setProductList(data);
    };

    const onDeleteNote = async (localName) => {
        try {
            // Find the note with the matching LocalName
            const noteToDelete = productList.find(item => item.LocalName === localName);
            if (!noteToDelete) {
                console.error('Note not found');
                return;
            }
            
            // Delete the note from Firestore
            await deleteDoc(doc(db, 'UserPost', noteToDelete.id));
    
            // Update the productList state by filtering out the deleted note
            setProductList(productList.filter(item => item.id !== noteToDelete.id));
        } catch (error) {
            console.error('Error deleting note: ', error);
        }
    };
    

    return (
        <View>
            <TouchableOpacity>
                <NotesDisplay displayList={productList} onDelete={onDeleteNote} />
            </TouchableOpacity>
        </View>
    );
}
