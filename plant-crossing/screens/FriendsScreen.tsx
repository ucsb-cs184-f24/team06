import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, Alert, Modal, ImageBackground } from 'react-native';
import filter from 'lodash.filter';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { globalStyles } from '../styles/globalStyles';
import DropDownPicker from 'react-native-dropdown-picker';
import { SeedService } from '../managers/SeedService';
import {rarityColorMap} from '../components/ShopItem';
import { Seed } from '../types/Seed';

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
  const [tradeModalVisible, setTradeModalVisible] = useState(false);
  const [userSeeds, setUserSeeds] = useState<Seed[]>([]);
  const [friendSeeds, setFriendSeeds] = useState<Seed[]>([]);
  const [selectedUserSeed, setSelectedUserSeed] = useState<string | null>(null);
  const [selectedFriendSeed, setSelectedFriendSeed] = useState<string | null>(null);
  const [userSeedDropdownOpen, setUserSeedDropdownOpen] = useState(false);
  const [friendSeedDropdownOpen, setFriendSeedDropdownOpen] = useState(false);
  const [pendingTrades, setPendingTrades] = useState<{friendEmail: string; userSeed: string; friendSeed: string; }[]>([]);
  const [pendingTradeModalVisible, setPendingTradeModalVisible] = useState(false);

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
    setPendingTrades(userDoc.data().pendingTrades || []);
  };

  const updateAllUsers = async () => {
    await checkFriends();
    const querySnapshot = await getDocs(collection(db, "users"));
    const emails: string[] = [];
    querySnapshot.forEach((doc) => {
      const email = doc.data().email;
      if (email != userEmail) {
        emails.push(email);
      }
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

  const fetchTradeSeeds = async (friendEmail: string) => {
    try {
      const userSeedsList = await SeedService.getUserSeeds();
      setUserSeeds(userSeedsList);
      
      const friendQuery = query(
        collection(db, "users"),
        where("email", "==", friendEmail)
      );
      const friendSnaphot = await getDocs(friendQuery);
  
      if (friendSnaphot.empty) {
        console.log('Friend not found');
        return;
      }
      const friendDoc = friendSnaphot.docs[0];
      const friendId = friendDoc.id;
      const friendSeedsSnapshot = await getDocs(
        collection(db, "users", friendId, "seeds")
      );
      // const friendSeeds = friendSeedsSnapshot.docs.map(doc => doc.data().type);
      const friendSeeds = friendSeedsSnapshot.docs.map(doc => {
        const data = { ...doc.data(), id: doc.id };
        return Seed.fromFirestore(data);
      });

      setFriendSeeds(friendSeeds);

      
    } catch (error) {
      console.error("Error fetching seeds:", error);
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

  if (error) {
    return(
      <View style={styles.textName}>
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
      setSearchQuery('');
      setShowSearchResults(false);
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

  const handleTrade = async () => {
    if (selectedFriend) {
      await fetchTradeSeeds(selectedFriend);
      setFriendActionsModalVisible(false);
      setTimeout(() => {
        setTradeModalVisible(true);
      }, 1000);
    }
  };

  const handleTradeRequest = async () => { // User A makes trade offer to User B
    console.log("trade request fields", selectedUserSeed, selectedFriendSeed, selectedFriend);
    if (!selectedUserSeed || !selectedFriendSeed || !selectedFriend) {
      console.error("Trade request missing required fields.");
      return;
    }
    await SeedService.sendSeedTradeRequest(userEmail, selectedUserSeed, selectedFriend, selectedFriendSeed);
    setTradeModalVisible(false);
    Alert.alert(
      "Trade Request Sent",
      `You offered a ${selectedUserSeed} in exchange for a ${selectedFriendSeed}.`
    );
    setSelectedFriendSeed(null);
    setSelectedUserSeed(null);
  }


  // set modal for pending trade request
  const handleIncomingTrade = async (friendEmail: string, friendSeed: string, userSeed: string) => {
    setSelectedUserSeed(userSeed);
    setSelectedFriendSeed(friendSeed);
    setSelectedFriend(friendEmail);
    setPendingTradeModalVisible(true);
  }

  const handleAcceptTrade = async () => { // User B accepts trade from User A
    if (!selectedUserSeed || !selectedFriendSeed || !selectedFriend) {
      console.error("Trade request missing required fields.");
      return;
    }

    try{
      await SeedService.tradeSeed(selectedUserSeed, selectedFriendSeed, selectedFriend);
      Alert.alert(
        "Trade Successful",
        `You traded your ${selectedUserSeed} for ${selectedFriendSeed}.`
      );
    } catch{
      Alert.alert(
        "Trade Unsuccessful",
      );
    }
    
    //delete trade request
    await SeedService.deleteTradeRequest(userEmail, selectedUserSeed, selectedFriend, selectedFriendSeed);
    setSelectedFriendSeed(null);
    setSelectedUserSeed(null);
    setPendingTradeModalVisible(false);
    await checkFriends(); //update pending trades list
  }

  const handleRejectTrade = async () => { // User B rejects trade from User A
    if (!selectedUserSeed || !selectedFriendSeed || !selectedFriend) {
      console.error("Trade request missing required fields.");
      return;
    }

    await SeedService.deleteTradeRequest(userEmail, selectedUserSeed, selectedFriend, selectedFriendSeed);
    Alert.alert(
      "Trade Rejected",
      `You did not trade your ${selectedUserSeed} for ${selectedFriendSeed}.`
    );
    setSelectedFriendSeed(null);
    setSelectedUserSeed(null);
    setPendingTradeModalVisible(false);
    await checkFriends(); //update pending trades list
  }

  useEffect(() => {
    checkFriends();
    updateAllUsers();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
      source={require('../assets/pixel-flowers.jpeg')}
      style={styles.backgroundImage}
      resizeMode="cover">
        <Text style={[globalStyles.text, styles.title]}>Friends</Text>
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
              style={styles.searchTextBg}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => handleAddFriendPress(item)}>
                  <View>
                  <Text style={[globalStyles.text, styles.textName]}>{item}</Text>
                  </View>
                </TouchableOpacity>
              )}
            /> : 
            <View style={styles.friendsElement}>
              <FlatList 
                data={friends}
                keyExtractor={(item) => item}
                style={[styles.textBg, { flex: 1, minHeight: 345 }]}
                renderItem={({item}) => (
                  <TouchableOpacity onPress={() => handleFriendPress(item)}>
                    <Text style={[globalStyles.text, styles.friendListItem]}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
      
            

            {/* display pending trades */}
            <ImageBackground
              source={require('../assets/pending-trades-background.jpg')}
              style={styles.pendingTradesBackgroundImage}
              resizeMode="cover">
              <View style={styles.pendingTradesElement}>
                <Text style={globalStyles.heading}>
                    Pending Trades
                  </Text>
                <View style={styles.trades}>
                  
                  <FlatList
                    data={pendingTrades}
                    keyExtractor={(item, index) => index.toString()}
                    style={[{ flex: 1, minHeight: 155 }]}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleIncomingTrade(item.friendEmail, item.friendSeed, item.userSeed)}>
                        <View style={styles.tradeOffer}>
                          <Text style={globalStyles.text}>
                            {item.friendEmail} offers:
                          </Text>
                          <Text style={[globalStyles.text, {color: '#50de51'}]}>
                            {`${item.userSeed} for ${item.friendSeed}`}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
              </ImageBackground>
          </View>
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

        {/* Trade Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={tradeModalVisible}
          onRequestClose={() => setTradeModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={[styles.modalTitle, globalStyles.text]}>Trade Request</Text>
              <Text style={[styles.modalEmail, globalStyles.text]}>
                Trading with {selectedFriend}
              </Text>

              <Text style={styles.modalTitle}>Your Seeds</Text>
              <View>
                <DropDownPicker
                  open={userSeedDropdownOpen}
                  setOpen={setUserSeedDropdownOpen}
                  value={selectedUserSeed}
                  setValue={setSelectedUserSeed}
                  items={userSeeds.map((seed) => ({ label: `${seed.type} (You have: ${seed.numSeeds})`, value: seed.type }))}
                  placeholder="Select a seed"
                  containerStyle={{ 
                    marginBottom: 20, 
                    zIndex: 2
                  }}
                  style={{ zIndex: 2 }}
                  dropDownContainerStyle={{ zIndex: 2 }}
                />
              </View>

              <Text style={styles.modalTitle}>Friend's Seeds</Text>
              <DropDownPicker
                open={friendSeedDropdownOpen}
                setOpen={setFriendSeedDropdownOpen}
                value={selectedFriendSeed}
                setValue={setSelectedFriendSeed}
                items={friendSeeds.map((seed) => ({ label: `${seed.type} (Friend has: ${seed.numSeeds})`, value: seed.type }))}
                placeholder="Select a friend's seed"
                containerStyle={{ 
                  marginBottom: 20, 
                  zIndex: 1 
                }}
                style={{ zIndex: 1 }}
                dropDownContainerStyle={{ zIndex: 1 }}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.tradeButton]}
                  onPress={handleTradeRequest}
                >
                  <Text style={[styles.buttonText, globalStyles.text]}>
                    Send Request
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setTradeModalVisible(false);
                    setSelectedFriendSeed(null);
                    setSelectedUserSeed(null);
                  }}
                >
                  <Text style={[styles.buttonText, globalStyles.text]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </Modal>




       {/* Pending Trades Modal */}
       <Modal
        animationType="fade"
        transparent={true}
        visible={pendingTradeModalVisible}
        onRequestClose={() => setPendingTradeModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, globalStyles.text]}>Trade Request</Text>
              <Text style={[styles.modalEmail, globalStyles.text]}>
              {`${selectedFriend} has sent you a trade request:\nFriend's Seed: ${selectedUserSeed}\nYour Seed: ${selectedFriendSeed}`}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.tradeButton]}
                onPress={handleAcceptTrade}
              >
                <Text style={[styles.buttonText, globalStyles.text]}>Accept Trade</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleRejectTrade}
              >
                <Text style={[styles.buttonText, globalStyles.text]}>Reject Trade</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setPendingTradeModalVisible(false)}
              >
                <Text style={[styles.buttonText, globalStyles.text]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingBottom:0
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingBottom:0
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 10,
  },
  searchBar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: '#fff',
  },
  textName: {
    fontSize: 16,
    marginLeft: 15,
    marginVertical: 5,
  },
  friendListItem: {
    fontSize: 16,
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
  pendingTradesElement: {
    height:'100%',
    paddingTop: 5,
    // alignContent: 'flex-end'
  },
  trades: {
    // backgroundColor: "#02aba0",
    padding: 20,
    paddingTop: 5,
    alignContent: 'flex-end'
  },
  tradeOffer: {
    backgroundColor: "white",
    padding: 10
  },
  textBg: {
    backgroundColor: '#fff',
    marginHorizontal: '5%',
    marginTop: '5%',
    marginBottom: '5%',
  },
  searchTextBg: {
    backgroundColor: '#fff',
    marginHorizontal: '5%',
    marginBottom: '15%',
  },
  pendingTradesBackgroundImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    zIndex: 2
  },
  friendsElement: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
    zIndex: 2
  }
});