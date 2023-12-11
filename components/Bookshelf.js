import { useState, useEffect } from 'react';
import { View, FlatList, Image, Alert } from 'react-native';
import { Text, Button, Surface, Card } from 'react-native-paper';
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
        Alert.alert('Remove book from saved?', 'The deletion will be permanent', 
        [{
              text: 'Cancel',
              style: 'cancel',
            },
            {text: 'OK', onPress: () => handleDelete(bookDetails)},
          ]);
      
      }

      const handleDelete = (bookDetails) => {
        const readRef = ref(database, 'books/');
        get(readRef).then((snapshot) => {
            snapshot.forEach((childSnap) => {
                if (childSnap.val().title === bookDetails.title) {
                const deleteRef = ref(database, 'books/' + childSnap.key);
                remove(deleteRef);
                }
            })
        })
              
      }

    const renderBook = ({ item }) => (
        <View style={{ flexDirection: 'row', marginTop: '3%', marginBottom: '5%'}}>   
            <Image 
                source={{ uri: item.book.imageLinks?.thumbnail}}                
                style = {{ width: 100, height: 130, marginRight: 10 }}
            />  
            <View style={{alignItems: 'flex-start', marginRight: '35%', marginLeft: '5%'}}>
                <Text variant='titleMedium'>{item.book.title}</Text>
                <Text variant='bodyLarge'>{item.book.authors?.join(', ')}</Text>
                <AirbnbRating
                    reviews={['']}
                    selectedColor="rgb(225, 161, 3)"
                    size={30}
                    defaultRating={item.rating === '' ? 0 : item.rating.rating}
                    onFinishRating={(rating) => addRating(rating, item.book)}
                />
                <Button mode='contained' onPress={() => deleteItem(item.book)}>Delete book</Button>

            </View>
                                                  
            
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
