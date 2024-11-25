import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import filter from 'lodash.filter';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { globalStyles } from '../styles/globalStyles';

const db = FIRESTORE_DB;

export default function FriendsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);
  const [friendActionsModalVisible, setFriendActionsModalVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [friends, setFriends] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");

  const checkFriends = async () => {
    const user = FIREBASE_AUTH.currentUser;

    if (!user) {
      Alert.alert('Error', 'Please log in to view your friends.');
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      Alert.alert('Error', 'User data not found.');
      return;
    }

    setUserEmail(userDoc.data().email);
    setFriends(userDoc.data().friends || []);
  };

  const updateAllUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const emails: string[] = [];
    querySnapshot.forEach((doc) => {
      emails.push(doc.data().email);
    });
    setFullData(emails);
  };

  const addFriend = async (userEmail: string, friendEmail: string) => {
    try {
      const q = query(collection(db, "users"), where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("User not found.");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userDocRef = doc(db, "users", userDoc.id);

      await updateDoc(userDocRef, {
        friends: arrayUnion(friendEmail)
      });
    } catch (error) {
      console.error("Error updating user field:", error);
    }
  };

  const removeFriend = async (userEmail: string, friendEmail: string) => {
    try {
      const q = query(collection(db, "users"), where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("User not found.");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userDocRef = doc(db, "users", userDoc.id);

      await updateDoc(userDocRef, {
        friends: arrayRemove(friendEmail)
      });
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query !== "") {
      const formattedQuery = query.toLowerCase();
      const filteredData = filter(fullData, (email: string) => {
        return contains(email, formattedQuery);
      });
      setData(filteredData);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const contains = (email: string, query: string) => {
    return email.toLowerCase().includes(query);
  };

  useEffect(() => {
    checkFriends();
    updateAllUsers();
  }, []);

  if (error) {
    return(
      <View style={styles.list}>
        <Text>Error in fetching data</Text>
      </View>
    );
  }

  const handleAddFriendPress = (item: string) => {
    setSelectedFriend(item);
    setAddFriendModalVisible(true);
  };

  const handleFriendPress = (item: string) => {
    setSelectedFriend(item);
    setFriendActionsModalVisible(true);
  };

  const handleAddFriend = async () => {
    if (selectedFriend && userEmail) {
      await addFriend(userEmail, selectedFriend);
      await addFriend(selectedFriend, userEmail);
      await checkFriends();
      
      Alert.alert(
        'Success',
        `Successfully added ${selectedFriend} as a friend!`
      );
      setAddFriendModalVisible(false);
      setSelectedFriend(null);
    }
  };

  const handleDeleteFriend = async () => {
    if (selectedFriend && userEmail) {
      await removeFriend(userEmail, selectedFriend);
      await removeFriend(selectedFriend, userEmail);
      await checkFriends();
      
      Alert.alert(
        'Success',
        `Successfully removed ${selectedFriend} from friends`
      );
      setFriendActionsModalVisible(false);
      setSelectedFriend(null);
    }
  };

  const handleTrade = () => {
    Alert.alert('Coming Soon', 'Trading feature is not yet implemented');
    setFriendActionsModalVisible(false);
  };

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

      {showSearchResults ? 
        <FlatList
          data={data}
          keyExtractor={(item) => item}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleAddFriendPress(item)}>
              <View>
                <Text style={styles.textName}>{item}</Text>
              </View>
            </TouchableOpacity>
          )}
        /> : 
        <FlatList 
          data={friends}
          keyExtractor={(item) => item}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleFriendPress(item)}>
              <Text style={styles.friendListItem}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      }

      {/* Add Friend Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={addFriendModalVisible}
        onRequestClose={() => setAddFriendModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, globalStyles.text]}>Add Friend</Text>
              <Text style={[styles.modalEmail, globalStyles.text]}>{selectedFriend}</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.addButton]}
                onPress={handleAddFriend}
              >
                <Text style={[styles.buttonText, globalStyles.text]}>Add Friend</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setAddFriendModalVisible(false)}
              >
                <Text style={[styles.buttonText, globalStyles.text]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Friend Actions Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={friendActionsModalVisible}
        onRequestClose={() => setFriendActionsModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, globalStyles.text]}>Friend Options</Text>
              <Text style={[styles.modalEmail, globalStyles.text]}>{selectedFriend}</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.tradeButton]}
                onPress={handleTrade}
              >
                <Text style={[styles.buttonText, globalStyles.text]}>Trade</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDeleteFriend}
              >
                <Text style={[styles.buttonText, globalStyles.text]}>Delete Friend</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setFriendActionsModalVisible(false)}
              >
                <Text style={[styles.buttonText, globalStyles.text]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    borderRadius: 8,
    marginBottom: 10,
  },
  textName: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
    marginVertical: 5,
  },
  friendListItem: {
    fontSize: 18,
    fontWeight: "500",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: "85%",
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalEmail: {
    fontSize: 20,
    color: "#666",
    marginBottom: 5,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "column",
    width: "100%",
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#34C759",
  },
  tradeButton: {
    backgroundColor: "#007AFF",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  cancelButton: {
    backgroundColor: "#8E8E93",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});