import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Image, Alert, Animated } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import firebaseConfig from './FirebaseConfig.js';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, push, remove } from "firebase/database";


const booksapp = initializeApp(firebaseConfig);
const database = getDatabase();



export default function Bookdetails( { route } ) {

  const { link } = route.params;
  const [book, setBook] = useState({});


  useEffect(() => {
    fetch(`${link}?key=AIzaSyDjogXo5kIAmE7IK49CnwXfXCnjp6au9uk`)
        .then(response => response.json())
        .then(data => {
            setBook(data.volumeInfo);
        })
        .catch((e) => console.error(e))
  }, []);


  const addBook = async() => {
    checkBook();
    try{
      const title = book.title;
      push(ref(database, 'books/'), {
          book, title, rating: ''
      });
    } catch (error) {
      console.error('Firebase error: ', error.code, error.message);
    }
    Alert.alert('Book saved!');  
};


  const checkBook = () => {
    const readRef = ref(database, 'books/');
        get(readRef).then((snapshot) => {
          snapshot.forEach((childSnap) => {
            if (childSnap.val().title === book.title) {
              const deleteRef = ref(database, 'books/' + childSnap.key);
              remove(deleteRef);
            } 
          })          
        })
  };


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
