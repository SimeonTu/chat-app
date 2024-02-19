import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
    const { name } = route.params;
    const { mode } = route.params;

    const [messages, setMessages] = useState([]);

    const onSend = (newMessages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
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
                // statusBarColor: '#521073',
                headerStyle: {
                    backgroundColor: '#521073',
                },
                headerTintColor: '#fff'
            })
        } else {
            navigation.setOptions({
                // statusBarColor: '#fff',
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerTintColor: '#521073'
            })
        }

        // display example text messages
        setMessages([
            {
                _id: 1,
                text: "Hello developer",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "React Native",
                    avatar: "https://static-00.iconduck.com/assets.00/user-circle-icon-2048x2048-rbk3fbd1.png",
                },
            },
            {
                _id: 2,
                text: "You've entered the chat",
                createdAt: new Date(),
                system: true,
            },
        ]);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {/* phone status bar */}
            <StatusBar
                backgroundColor={mode === "light" ? "#521073" : "white"}
                barStyle={mode === "light" ? "light-content" : "dark-content"}
            />

            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1
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