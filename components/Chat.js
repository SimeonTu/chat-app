import { useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected }) => {
    let { name } = route.params;
    const { mode } = route.params;
    const { userID } = route.params;
    const [messages, setMessages] = useState([]);
    let unsubMessages;

    // if no name was chosen in the start screen, format username as "Anon #(userID)"
    if (!name) {
        name = 'Anon #' + userID.slice(0, 5);
    }

    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0])
    }

    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: "#521073"
                },
                left: {
                    backgroundColor: "#FFF"
                }
            }}
        />
    }

    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    }

    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('all_messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    }

    const loadCachedMessages = async () => {
        let cachedMessages = await AsyncStorage.getItem("all_messages") || [];
        setMessages(JSON.parse(cachedMessages));
    }

    useEffect(() => {
        // set the header to the inputted name from the welcome screen
        if (!name) {
            navigation.setOptions({ title: "Unnamed" });
        } else {
            navigation.setOptions({ title: name });
        }

        // set the theme colors depending on the mode (light or dark)
        if (mode === "light") {
            navigation.setOptions({
                headerStyle: {
                    backgroundColor: '#521073',
                },
                headerTintColor: '#fff'
            })
        } else {
            navigation.setOptions({
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerTintColor: '#521073'
            })
        }

        // fetch from firestore only if there's an internet connection
        if (isConnected === true) {

            // unregister current onSnapshot() listener to avoid registering multiple listeners when useEffect code is re-executed.
            if (unsubMessages) unsubMessages();
            unsubMessages = null;

            // listening for DB updates in real time with the firestore onSnapshot() function
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, (msgs) => {
                let allMessages = [];
                msgs.forEach(msg => {
                    allMessages.push({ id: msg.id, ...msg.data() })
                });
                // console.log(new Date(allMessages[0].createdAt.seconds * 1000));

                // converting unix timestamp to date and time
                allMessages.forEach((msg, index) => {
                    // console.log("msg is:", msg);
                    msg.createdAt = new Date(allMessages[index].createdAt.seconds * 1000)
                })

                cacheMessages(allMessages)
                setMessages(allMessages);
            });
        } else loadCachedMessages()

        // Clean up code
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, [isConnected]);

    return (
        <View style={{ flex: 1 }}>
            {/* phone status bar */}
            <StatusBar
                backgroundColor={mode === "light" ? "#521073" : "white"}
                barStyle={mode === "light" ? "light-content" : "dark-content"}
            />

            <GiftedChat
                // isTyping={true}
                alwaysShowSend={true}
                renderUsernameOnMessage={true}
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                // custom username formatting test
                // renderUsername={() => {
                //     messages.forEach(msg => {
                //         (
                //             <Text style={{ paddingLeft: 6, paddingBottom: 6, paddingTop: 0, paddingRight: 0, textAlign: "center" }}>~ {msg.user.name}</Text>
                //         )
                //     })
                // }}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name
                }}
            />

            {/* keyboard fix for android */}
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    );
}

// Style sheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Chat;