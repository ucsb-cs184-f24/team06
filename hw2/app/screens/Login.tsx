import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const auth = FIREBASE_AUTH;
    
    const login = async () => {
        setLoading(true);
        try {
            const user = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            console.log(user);
        } catch (error) {
            alert('Login failed: ' + error);
            console.log(error);
        }
        setLoading(false);
    }

    const signup = async () => {
        setLoading(true);
        try {
            const user = await createUserWithEmailAndPassword(FIREBASE_AUTH,email, password);
            console.log(user);
        } catch (error) {
            alert('Signup failed: ' + error);
            console.log(error);
        }
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding'>
                <TextInput value={email} autoCapitalize="none" onChangeText={(text) => setEmail(text)}  placeholder="Email" />
                <TextInput value={password} autoCapitalize="none" onChangeText={(text) => setPassword(text)} placeholder="Password" secureTextEntry={true}/>
                    
                {loading ? (
                    <ActivityIndicator size="large" color='blue'/>
                ) : (
                    <>
                        <Button title='Login' onPress={login}/>
                        <Button title='Create Account' onPress={signup}/>
                    </>
                )}
            </KeyboardAvoidingView>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff',
    }
});