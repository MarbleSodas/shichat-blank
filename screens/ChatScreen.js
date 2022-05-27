import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, StatusBar, Platform, TextInput, ScrollView, Keyboard } from 'react-native';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { Avatar } from 'react-native-elements';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native-web';
import firebase from "firebase/compat/app";
import { db, auth } from '../firebase';

const ChatScreen = ({ navigation, route }) => {

    const [input, setInput] = useState("");

    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chat",
            headerTitleAlign: "left",
            headerBackTitleVisible: false,
            headerTitle: () => (
                <View 
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                >
                    <Avatar rounded source={{ uri: messages[0]?.data.photoURL ||
                    "https://i.imgur.com/7cZWUmz.png" }} />
                    <Text>{route.params.chatName}</Text>
                </View>
            ),
            headerRight: () => (
                <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 70,
                    marginRight: 10,
                }}
                >
                    <TouchableOpacity>
                        <FontAwesome name="video-camera" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="call" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation, messages]);

    const sendMessage = () => {
        Keyboard.dismiss();
        db.collection('chats').doc(route.params.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        });

        setInput("");
    };

    useLayoutEffect(() => {
        const unsubscribe = db.collection('chats')
        .doc(route.params.id)
        .collection('messages')
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => setMessages(
            snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            }))
        ));
        return unsubscribe;
    }, [route]);

  return (
    <SafeAreaView style={{ 
        flex: 1,
        backgroundColor: "white",
    }}>
        <StatusBar style="light" />
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 130}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <>
                    <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
                        {messages.map(({id, data}) => (
                            data.email === auth.currentUser.email ? (
                                <View key={id} style={styles.reciever}>
                                    <Avatar
                                        position="absolute"
                                        bottom={-15}
                                        right={-5}
                                        rounded
                                        size={30}
                                        source={{
                                            uri: data.photoURL,
                                        }}
                                     />
                                    <Text style={styles.recieverText}>{data.message}</Text>
                                </View>
                            ): (
                                <View key={id} style={styles.sender}>
                                    <Avatar 
                                        position="absolute"
                                        bottom={-15}
                                        left={-5}
                                        rounded
                                        size={30}
                                        source={{
                                            uri: data.photoURL,
                                        }}
                                    />
                                    <Text style={styles.senderText}>{data.message}</Text>
                                    <Text style={styles.senderName}>{data.displayName}</Text>
                                </View>
                            )
                        ))}
                    </ScrollView>
                    <View style={styles.footer}>
                        <TextInput value={input}
                        onChangeText={(text) => setInput(text)} 
                        onSubmitEditing={sendMessage}
                        placeholder="Shichat message" 
                        style={styles.textInput}
                        />
                        <TouchableOpacity onPress={sendMessage} activeOpacity={0.3}>
                            <Ionicons name="send" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    footer:{
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        padding: 15,
    },
    textInput:{
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        borderColor: "transparent",
        backgroundColor: "#ECECEC",
        padding: 10,
        color: "grey",
        borderRadius: 30,
    },
    reciever:{
        padding: 15,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-end",
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: "80%",
        position: "relative",
        alignContent: "center",
    },
    recieverText:{
        color: "black",
        fontWeight: "500",
    },
    sender:{
        padding: 15,
        backgroundColor: "#99DFA7",
        alignSelf: "flex-start",
        borderRadius: 20,
        marginLeft: 15,
        marginBottom: 20,
        maxWidth: "80%",
        position: "relative",
    },
    senderText:{
        color: "white",
        fontWeight: "500",
    },
    senderName:{
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: "white",
    },
})