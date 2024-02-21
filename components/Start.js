import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Platform, Pressable, Dimensions, Appearance, StatusBar, Alert } from 'react-native';
import { signInAnonymously, initializeAuth, getReactNativePersistence, ReactNativeAsyncStorage } from "firebase/auth";
import BackgroundLight from '../assets/backgroundLight.svg'
import BackgroundDark from '../assets/backgroundDark.svg'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const Start = ({ navigation, auth }) => {
    const [name, setName] = useState("");
    const [mode, setMode] = useState(Appearance.getColorScheme()) // finding out the user's initial color scheme (light or dark)
    const [bgColor, setBgColor] = useState("")
    const [modeColor, setModeColor] = useState("")
    const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height)

    const signInUser = () => {
        signInAnonymously(auth)
            .then(result => {
                navigation.navigate('Chat', { userID: result.user.uid, name: name, mode: mode })
                Alert.alert("Signed in Successfully!");
            })
            .catch((error) => {
                console.log(error);
                Alert.alert("Unable to sign in, try later again.");
            })
    }

    // function used to toggle between light and dark mode
    const toggleMode = () => {
        if (mode === "light") {
            setMode("dark")
            setBgColor({ backgroundColor: "#521073" })
            setModeColor({ backgroundColor: "white" })
            // navigation.setOptions({ statusBarColor: '#fff' })
        } else {
            setMode("light")
            setBgColor({ backgroundColor: "white" })
            setModeColor({ backgroundColor: "#521073" })
            // navigation.setOptions({ statusBarColor: '#521073' })
        }
    }

    useEffect(() => {

        // setting initial statesz
        if (mode === "light") {
            setBgColor({ backgroundColor: "white" })
            setModeColor({ backgroundColor: "#521073" })
        } else {
            setBgColor({ backgroundColor: "#521073" })
            setModeColor({ backgroundColor: "white" })
        }

        console.log(mode);
        console.log(screenHeight);

    }, [mode])


    return (
        <View style={[styles.container, bgColor]}>

            {/* phone status bar */}
            <StatusBar
                backgroundColor={mode === "light" ? "#521073" : "white"}
                barStyle={mode === "light" ? "light-content" : "dark-content"}
            />


            {/* Light/Dark Mode Switch */}
            <View style={[styles.modeButtonContainer, styles.shadow]}>
                <Pressable
                    style={[styles.modeButton, modeColor]}
                    android_ripple={mode === "light" ? { color: 'white' } : { color: "#521073" }}
                    onPress={toggleMode}
                >
                    {mode === "light" ? (
                        <FontAwesome6 name="moon" size={24} color={"white"} solid />
                    ) : (
                        <FontAwesome6 name="sun" size={24} color={"#521073"} solid />
                    )}

                </Pressable>
            </View>

            {/* Heading */}
            <View
                style={{ ...styles.headingContainer, ...modeColor, top: screenHeight * 0.2 }}>

                <Text style={mode === "light" ? { ...styles.heading, color: "white" } : { ...styles.heading, color: "#521073" }}>Welcome!</Text>
            </View>

            {/* fixed background svg */}
            <View style={{ ...styles.background, height: screenHeight }}>
                {mode === "light" ? (<BackgroundLight />) : (<BackgroundDark />)}
            </View>

            {/* welcome container */}
            <View style={[styles.welcomeBox, styles.shadow, bgColor]}>
                {/* username text input */}
                <View style={styles.textContainer}>
                    <FontAwesome6 style={{ marginLeft: 2.5, marginRight: 10 }} name="user" size={20} color="grey" />
                    <TextInput
                        style={{ flex: 1 }}
                        value={name}
                        onChangeText={setName}
                        placeholder='Your Name'
                        placeholderTextColor={"rgba(0,0,0,0.4)"}
                    />
                </View>

                {/* start chatting button */}
                <Pressable style={[styles.button, modeColor]}
                    onPress={signInUser}
                >
                    <Text style={mode === "light" ? { color: "white" } : { color: "#521073" }}>
                        Start Chatting
                    </Text>
                </Pressable>
            </View>

            {/* keyboard fix for ios */}
            {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
        </View>
    );
}

// Style Sheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    background: {
        position: "absolute",
        height: "100%",
        width: "100%",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: -1,
    },
    headingContainer: {
        position: "absolute",
        width: "80%",
        padding: 10,
        backgroundColor: "white",
        // top: 200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 7
    },
    heading: {
        textAlign: "center",
        fontSize: 40
    },
    textContainer: {
        backgroundColor: "white",
        flexDirection: 'row',
        alignItems: "center",
        width: "100%",
        height: 60,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderWidth: 1,
        borderColor: "grey"
    },
    welcomeBox: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "88%",
        height: 175,
        marginBottom: 40,
        padding: 20,
        backgroundColor: "white",
    },
    button: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 55,
        backgroundColor: "#521073",
        // borderRadius: 7
    },
    modeButtonContainer: {
        position: "absolute",
        top: 30,
        right: 30,
        overflow: "hidden",
        borderRadius: 7
    },
    modeButton: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 45,
        elevation: 7
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    }
});

export default Start;