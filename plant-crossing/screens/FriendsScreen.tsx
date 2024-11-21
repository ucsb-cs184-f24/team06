import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import filter from 'lodash.filter';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';

const API_ENDPOINT = `https://randomuser.me/api/?results=30`; // mocking other user data

var userDocRef;
var friends = [];
var usersEmailList = [];
var userEmail;
const db = FIRESTORE_DB;

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

  userEmail = userDoc.data().email;
  const friendsList: string[] = userDoc.data().friends;
  friends = friendsList;
}

const updateAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  (querySnapshot).forEach((doc) => {
    usersEmailList.push(doc.data().email); // in the future, get the names and/or usernames
  });
}

const addFriend = async (userEmail, friendEmail) => {
  try {
    // Query for the document with the specific field value
    const q = query(collection(db, "users"), where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);

    // Check if the document exists
    if (querySnapshot.empty) {
      console.log("User not found.");
      return;
    }

    // Get the document reference
    const userDoc = querySnapshot.docs[0]; // Assuming there's only one match
    const userDocRef = doc(db, "users", userDoc.id);

    // Update the desired field
    await updateDoc(userDocRef, {
      friends: arrayUnion(friendEmail)
    });
  } catch (error) {
    console.error("Error updating user field:", error.message);
  }
}

export default function FriendsScreen() {
  checkFriends();

  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query != "") {
      const formattedQuery = query.toLowerCase();
      const filteredData = filter(fullData, (email: any) => {
        return contains(email, formattedQuery);
      });
      setData(filteredData);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const contains = (email, query) => {
    if (email.includes(query)) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async() => {
    try {
      await updateAllUsers();
      setFullData(usersEmailList);

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
      const friendEmail = item;

      addFriend(userEmail, friendEmail);
      addFriend(friendEmail, userEmail);

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
          keyExtractor={(item) => item}
          renderItem={({item}) => (
            <View>
              <TouchableOpacity onPress={() => handlePress(item)}>
                <View>
                  {/* <Text style={styles.textName}>{item.name.first} {item.name.last}</Text> */}
                  <Text style={styles.textName}>{item}</Text>
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
    marginVertical: 5,
  },
  textEmail: {
    fontSize: 14,
    marginLeft: 10,
    color: "gray",
  }
});

