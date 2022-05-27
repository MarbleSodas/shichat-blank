import { StyleSheet, View, Text, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Input, Image, withTheme } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { auth } from '../firebase';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            console.log(authUser);
            if(authUser) {
                navigation.replace("Home");
            }
        });
        return unsubscribe;
    }, []);

    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password).catch((error) => alert(error));
    };

  return (
    <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
        <StatusBar style="light" />

        <Image source={require('../assets/images/Shichat_logo.png')}
            style={{ width: 150, height: 150 }}
        />
        <View style={styles.inputContainer}>
            <Input 
            placeholder="Email" 
            autoFocus type="email" 
            value={email} 
            onChangeText={(text) => setEmail(text)} 
            />
            <Input 
            placeholder="Password"
            secureTextEntry 
            type="password" 
            value={password}
            onChangeText={(text) => setPassword(text)}
            onSubmitEditing={signIn}
            />
        </View>

        <Button containerStyle={styles.button} onPress={signIn} title="Login" />
        <Button containerStyle={styles.button} onPress={() => navigation.navigate("Register")} type="outline" title="Register" />
        <View style={{ height: 100 }}/>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        panning: 10,
        backgroundColor: 'white',
    },
    inputContainer: {
        width: 300,
    },
    button: {
        width: 200,
        marginTop: 10,
    },
});