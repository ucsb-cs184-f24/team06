import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;


    const signIn = async () => {
        setLoading(true);
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            console.log(res);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async () => {
        setLoading(true);
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            console.log(res);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <TextInput 
                    value={email}
                    style={styles.input}
                    placeholder="capper@gmail.com"
                    autoCapitalize="none"
                    autoComplete="off"
                    textContentType="emailAddress"
                    onChangeText={(text) => setEmail(text)}/>
                <TextInput 
                    value={password}
                    style={styles.input}
                    placeholder="password"
                    autoCapitalize="none"
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}/>
                { loading ? 
                    <ActivityIndicator 
                        size="large"
                        color="#0000ff"/>
                : <>
                    <Button title="Login" onPress={() => signIn()} />
                    <Button title="Sign Up" onPress={() => signUp()} />
                </>
                }
            </KeyboardAvoidingView>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
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