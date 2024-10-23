import { View, Text, Button } from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native'
import { FIREBASE_AUTH } from '../../FirebaseConfig';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>\
      <Text>email: {FIREBASE_AUTH.currentUser?.email}</Text>
      <Button onPress={() => navigation.navigate('Details')} title="Go to Details" />
      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
    </View>
  )
}

export default List