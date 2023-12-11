import React, { useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { useState } from 'react';
import { Card, Paragraph, Searchbar, Title, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


export default function Search() {


  const navigation = useNavigation();
  const [input, setInput] = useState('');
  const [books, setBooks] = useState([]);
  const [numBooks, setNumBooks] = useState('');


  useEffect(() => {
    if (!input) {
      setBooks('');
    } else {
      fetch('https://www.googleapis.com/books/v1/volumes?q=' + input + '&maxResults=40&key=AIzaSyDjogXo5kIAmE7IK49CnwXfXCnjp6au9uk')
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


  const renderListHeader = () => (
    <View>
      <Text style={{ color: 'grey', marginVertical: 10 }}>{books === '' ? '' : numBooks}</Text>
    </View>
  )


return (
  <View>
    <Searchbar
      style={{marginTop: '5%'}}
      mode='bar'
      placeholder="Type here..."
      onChangeText={input => setInput(input)}
      value={input}
      iconColor='rgb(116, 144, 147)'
      placeholderTextColor="rgb(116, 144, 147)"
    />

    <FlatList
    data={books}
    keyExtractor={(item) => item.id}
    ListHeaderComponent={renderListHeader}
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

      </Card>
    )} 
    />
  </View>

    );
};