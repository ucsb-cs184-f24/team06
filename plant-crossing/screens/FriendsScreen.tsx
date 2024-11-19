import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import filter from 'lodash.filter';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { arrayUnion, collection, doc, getDoc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';

const API_ENDPOINT = `https://randomuser.me/api/?results=30`; // mocking other user data

var userDocRef;
var friends = [];
const db = FIRESTORE_DB;
// const db = getFirestore();

const checkFriends = async () => {
  const user = FIREBASE_AUTH.currentUser;

  if (!user) {
    Alert.alert('Error', 'Please log in to view your friends.');
    return;
  }

  userDocRef = doc(db, 'users', user.uid);
  // Get the latest user data directly from Firestore
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) {
    Alert.alert('Error', 'User data not found.');
    return;
  }

  const friendsList: string[] = userDoc.data().friends || {};
  friends = friendsList;
  console.log("friendsList, ", friends);
}

const getAllUsers = async () => {
  console.log("hello?");
  const querySnapshot = await getDocs(collection(db, "users")); // TODO: Find out why this doesn't return anything
  console.log("hey");
  (querySnapshot).forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });
  
}

export default function FriendsScreen() {
  checkFriends();
  getAllUsers();

  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query != "") {
      const formattedQuery = query.toLowerCase();
      const filteredData = filter(fullData, (user: any) => {
        return contains(user, formattedQuery);
      });
      setData(filteredData);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const contains = ({name, email}, query) => {
    const {first, last} = name;

    if (first.includes(query) || last.includes(query) || email.includes(query)) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    fetchData(API_ENDPOINT);
  }, []);
  
  const fetchData = async(url: string | URL | Request) => { // TODO: rework this after using firebase
    try {
      const response = await fetch(url);
      const json = await response.json();
      // setData(json.results); 
      setFullData(json.results);
    } catch (error) {
      setError(error);
      console.log(error);
    }
  }

  if (error) {
    return(
      <View style={styles.list}>
        <Text>Error in fetching data</Text>
      </View>
    )
  }

  const handlePress = async (item) => {
    if(item){
      console.log(item);
      const friendUsername = item.login.username;
      console.log(friendUsername);

      // TODO: add user to friend's friend list as well, probably just need to get their uid from firestore then get doc similar to above
      await updateDoc(userDocRef, {
        friends: arrayUnion(friendUsername)
      });

      getAllUsers();
      checkFriends();
      return item;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Add Friend"
        clearButtonMode="always"
        autoCapitalize="none"
        autoCorrect={false}
        value={searchQuery}
        onChangeText={(query) => handleSearch(query)}/>

      {showSearchResults ? // only allow searching of users if they are typing, otherwise show existing friends list
        <FlatList
          data={data}
          keyExtractor={(item) => item.login.username} // TODO: with firebase, will prob be item.user.email
          renderItem={({item}) => (
            <View>
              <TouchableOpacity onPress={() => handlePress(item)}>
                <View>
                  <Text style={styles.textName}>{item.name.first} {item.name.last}</Text>
                  <Text style={styles.textEmail}>{item.email}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        /> : 
        <FlatList 
          data={friends}
          renderItem={({item}) => (
            <Text style={styles.list}>{item}</Text>
          )}
        /> }
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    fontSize: 12,
    paddingTop: 10,
  },
  searchBar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8
  },
  textName: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
  },
  textEmail: {
    fontSize: 14,
    marginLeft: 10,
    color: "gray",
  }
});

