import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Search from './components/Search';
import Bookshelf from './components/Bookshelf';
import Bookdetails from './components/BooksDetails';

import { createStackNavigator } from '@react-navigation/stack';

import { BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



const Stack = createStackNavigator();


const StackNavigation = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen name="Search list" component={Search}/>
      <Stack.Screen name="BookDetails" component={Bookdetails}/>
    </Stack.Navigator>
  );
}


export default function App() {

  
  const Tab = createBottomTabNavigator();

  const BottomTabNavigator = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            
            if (route.name == 'Search') {
              iconName = 'book-search';
            } else if (route.name == 'Bookshelves') {
              iconName = 'bookshelf';
            }

          return <Icon name={iconName} size={size} color={color} />; 
          },
          
        })}
      >

        <Tab.Screen
          name="Search"
          component={StackNavigation}
        />
        <Tab.Screen
          name="Bookshelves"
          component={Bookshelf}
        />
      </Tab.Navigator>
    );
  };


  return (
    <NavigationContainer>
      {<BottomTabNavigator /> }
    </NavigationContainer>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
