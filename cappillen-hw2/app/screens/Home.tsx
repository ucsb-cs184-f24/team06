import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";

interface RouterProps {
    navigation: NavigationProp<any, any>;
}
const Home = ({navigation}: RouterProps) => {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (user) => {
            setUser(user);
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text>Hello, your email is {user?.email}</Text>
            <Button onPress={() => navigation.navigate('Profile')} title="Profile"/>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: 'fff'
    }
});