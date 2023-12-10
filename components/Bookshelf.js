import { useState, useEffect } from 'react';
import { View, FlatList, Image, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, get, remove, update } from "firebase/database";
import { AirbnbRating } from 'react-native-ratings';
import firebaseConfig from './FirebaseConfig';



const booksapp = initializeApp(firebaseConfig);
const database = getDatabase();

export default function Bookshelf() {

    const [books, setBooks] = useState([]);

    useEffect(() => {
        const booksRef = ref(database, 'books/')
        onValue(booksRef, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                setBooks([]);
            } else {
                setBooks(Object.values(data));
            }
        })
    }, []);



    const addRating = (rating, book) => {
        const readRef = ref(database, 'books/');
        get(readRef).then((snapshot) => {
          snapshot.forEach((childSnap) => {
            if (childSnap.val().book.title === book.title) {
              update(ref(database, 'books/' + childSnap.key + '/rating'), {
                rating
              })
            }
          })
        })
      }


      const deleteItem = (bookDetails) => {
        Alert.alert(
          'Remove book from saved?',
          [
            { text: 'NO', style: 'cancel' },
            {
              text: 'YES', onPress: () => {
                const readRef = ref(database, 'books/');
                onValue(readRef, (snapshot) => {
                  snapshot.forEach((childSnap) => {
                    if (childSnap.val().book.title === bookDetails.title) {
                      const deleteRef = ref(database, 'books/' + childSnap.key);
                      remove(deleteRef);
                    }
                  })
                })
              }
            },
          ]
        )
      }


    const renderBook = ({ item }) => (
        <View>
            <Image style={{ width: 100, height: 100}}
                source={{ uri: item.book.imageLinks?.thumbnail}}
                //resizeMode='contain'
                
            />
            <Text>{item.book.title}</Text>
            <Text>{item.book.author}</Text>
            <AirbnbRating
                reviews={['']}
                selectedColor="rgb(225, 161, 3)"
                size={30}
                defaultRating={item.rating === '' ? 0 : item.rating.rating}
                onFinishRating={(rating) => addRating(rating, item.book)}
            />
            <Button onPress={() => deleteItem(item.book)}
            >Delete book</Button>
        </View>
    )

    const renderSeparator = () => (
        <View
          style={{
            backgroundColor: 'lightgrey',
            height: 0.5,
          }}
        />
      )



    return (
    <View>
        <FlatList 
        
            ItemSeparatorComponent={renderSeparator}
        
            style={{marginLeft: '5%'}}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderBook}
            data={books}
        />
    </View>
    );
};
