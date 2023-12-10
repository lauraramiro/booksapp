import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Image, Alert } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import firebaseConfig from './FirebaseConfig.js';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push } from "firebase/database";


const booksapp = initializeApp(firebaseConfig);
const database = getDatabase();


export default function Bookdetails( { route } ) {

  const { link } = route.params;
  const [book, setBook] = useState({});
  const [exists, setExists] = useState(false);

  useEffect(() => {
    fetch(`${link}?key=AIzaSyDjogXo5kIAmE7IK49CnwXfXCnjp6au9uk`)
        .then(response => response.json())
        .then(data => {
            setBook(data.volumeInfo);
        })
        .catch((e) => console.error(e))
  }, []);


  const addBook = async () => {
   await checkBook();
    if (exists === false) {
      try{
        push(ref(database, 'books/'), {
            book, rating: ''
        });
      } catch (error) {
        console.error('Firebase error: ', error.code, error.message);
      }
      Alert.alert('Book saved!');
    } else {
        Alert.alert('Book Is Already Saved');
    }

};


  const checkBook = async () => {

    const readRef = ref(database, 'books/' );
    setExists(false);
    onValue(readRef, (snapshot) => {
        snapshot.forEach((childSnap) => {

            if (childSnap.val().book.title === book.title) {
              setExists(true);
            } 
        })
    })

  }


    return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Surface style={styles.surface} elevation={4}>
          <Image
              style={{ width: 200, height: 200}}
              source={{ uri: book.imageLinks?.thumbnail }}
              resizeMode='contain'
          />
          <Text variant='headlineMedium'>{book.title}</Text>
          <Text variant='titleMedium'>{book.authors?.join(', ')}</Text>
          <Button mode="contained" onPress={() => addBook()}>Save book</Button>
          
          <Text variant='bodyLarge'>{book.description}</Text>
        </Surface>

        </ScrollView>
    </View>
    );


};


const styles = StyleSheet.create({
  surface: {
    padding: 10,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});