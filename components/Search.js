import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, Alert } from 'react-native';
//import { SearchBar } from 'react-native-elements';
import { useState } from 'react';
import { Card, PaperProvider, Paragraph, Searchbar, Title, Button, IconButton } from 'react-native-paper';
import styles from './Styles';
import db from '../App.js'; 
import { getDatabase, ref, push, onValue, set, remove } from 'firebase/database';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { BookNav } from './BooksDetails.js';
import Bookdetails from './BooksDetails.js';


export default function Search() {


  const navigation = useNavigation();
  const [input, setInput] = useState('');
  const [books, setBooks] = useState([]);
  const [numBooks, setNumBooks] = useState('');
  const [bookToSave, setBookToSave] = useState({
    title: '',
    authors: '',
    abstract: '',
    key: ''
  });

  useEffect(() => {
    if (!input) {
      setBooks('');
    } else {
      fetch('https://www.googleapis.com/books/v1/volumes?q=${input}&maxResults=40&key=AIzaSyDjogXo5kIAmE7IK49CnwXfXCnjp6au9uk')
        .then(response => response.json())
        .then(data => {
          setBooks(data.items);
          const numToString = data.totalItems.toString();
          setNumBooks(numToString + ' results for "' + input + '"');
        })
        .catch((err) => {
          console.error('Error', err);
        });
    }
  }, [input]);



  const saveBook = (book) => {
    if (book.volumeInfo.title != '') {
    const newBookRef = push(ref(db, '/items')).key;
    setBookToSave({title: book.volumeInfo.title, authors: book.volumeInfo.authors[0], abstract: book.volumeInfo.description, key: newBookRef});
    set(ref(db, '/items/' + newBookRef), bookToSave);
    setBookToSave({title: '', authors: '', abstract: '', key: ''});
    }
  }

return (
  <View>
    <Searchbar
      style={{marginTop: '5%'}}
      mode='bar'
      //theme={ { colors: { surface: 'green' } }} // this is not working
      placeholder="Type here..."
      onChangeText={input => setInput(input)}
      value={input}
      iconColor='rgb(116, 144, 147)'
      placeholderTextColor="rgb(116, 144, 147)"
    />

   
    <FlatList
    data={books}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <Card onPress={() => navigation.navigate('BookDetails', { link: item.selfLink })}>
        <Card.Cover
              source={{ uri: item.volumeInfo.imageLinks?.thumbnail }}
              style={{ height: 100 }}
            />
        <Card.Content>
          <Title>{item.volumeInfo.title}</Title>
          <Paragraph>{item.volumeInfo.authors?.join(', ')}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => saveBook(item)}>Save book</Button>
        </Card.Actions>
      </Card>
    )} 
    />
  </View>

    );
};