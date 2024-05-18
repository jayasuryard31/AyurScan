import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig';
import { Formik } from 'formik';
import { getFirestore, getDocs, collection, addDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@clerk/clerk-expo';

export default function NoteScreen() {
  const [image, setImage] = useState(null);
  const db = getFirestore(app); 
  const { user } = useUser(); 
  const [loading, setLoading] = useState(false);
  const storage = getStorage();
  const [CategoryList, setCategoryList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [formValues, setFormValues] = useState({
    image: '',
    LocalName: '',
    BotanicalName: '',
    desc: '',
    userName: '',
    userEmail: '',
    userImage: '',
    createdAt: Date.now()
  });

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push(doc.data());
      });
      setCategoryList(categories);
    } catch (error) {
      console.error('Error fetching categories: ', error);
    }
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

  const onSubmitMethod = async (values) => {
    setLoading(true);
    const resp = await fetch(image);
    const blob = await resp.blob();
    const storageRef = ref(storage, 'Note/' + Date.now() + '.jpg');

    uploadBytes(storageRef, blob).then(() => {
      getDownloadURL(storageRef).then(async (downloadUrl) => {
        values.image = downloadUrl;
        values.userName = user.fullName;
        values.userEmail = user.primaryEmailAddress.emailAddress;
        values.userImage = user.imageUrl;
        const docRef = await addDoc(collection(db, 'UserPost'), values);
        if (docRef.id) {
          setLoading(false);
          Alert.alert('Success!!!', 'Post Added Successfully.');
        }
      });
    });
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await getCategoryList();
    setImage(null); // Reset image
    setFormValues({ // Reset form values
      image: '',
      LocalName: '',
      BotanicalName: '',
      desc: '',
      userName: '',
      userEmail: '',
      userImage: '',
      createdAt: Date.now()
    });
    setRefreshing(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        className="mt-4"
      >
        <Text style={styles.title}>Add a new note</Text>
        <Text style={styles.subtitle}>Create a note for reference</Text>
        <Formik
          initialValues={formValues}
          onSubmit={values => onSubmitMethod(values)}
          validate={values => {
            const errors = {};
            if (!values.LocalName) {
              Alert.alert('Error', 'Local Name must be there.');
              errors.LocalName = "LocalName field can't be empty";
            }
            return errors;
          }}
        >
          {({ handleChange, handleSubmit, values }) => (
            <View style={styles.formContainer}>
              <TouchableOpacity onPress={pickImage}>
                {image ? 
                  <Image source={{uri: image}} style={styles.image} />
                  :
                  <Image source={require('./../Images/placeholder.jpg')} style={styles.placeholderImage}/>
                }
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder='Local Name'
                value={values.LocalName}
                onChangeText={handleChange('LocalName')}
              />
              <TextInput
                style={styles.input}
                placeholder='Botanical Name'
                value={values.BotanicalName}
                onChangeText={handleChange('BotanicalName')}
              />
              <TextInput
                style={styles.descInput}
                placeholder='Description'
                value={values.desc}
                multiline={true}
                onChangeText={handleChange('desc')}
              />
              <TouchableOpacity onPress={handleSubmit} 
                style={[
                  styles.submitButton,
                  {backgroundColor: loading ? '#ccc' : '#03A57D'}
                ]}
                disabled={loading}
              >
                {loading ?
                  <ActivityIndicator color='#fff'/>
                  :
                  <Text style={styles.submitButtonText}>Submit</Text>
                }
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    marginBottom: 20,
  },
  formContainer: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginBottom: 20,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: '#E5E7EB',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 17,
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  descInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    paddingHorizontal: 17,
    width: '100%',
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#03A57D',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
