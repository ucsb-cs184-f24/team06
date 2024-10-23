import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from "react-native";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { FIREBASE_AUTH } from "../../FirebaseConfig";

const Profile = () => {

    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (user) => {
            setUser(user);
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text>Email: {user?.email}</Text>
            <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout"/>
        </View>
    );
};

export default Profile;

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