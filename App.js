import { useEffect } from "react";
import { StyleSheet, LogBox, Text, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getAuth, signInAnonymously, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { useNetInfo } from "@react-native-community/netinfo";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Start from './components/Start';
import Chat from './components/Chat';

// ignore warning message
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

// Create the navigator
const Stack = createNativeStackNavigator();

// options for the react navigation header
const options = {
  // statusBarColor: '#521073',
  headerStyle: {
    backgroundColor: '#521073',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
}

export default function App() {

  // represents the current network connectivity status
  const connectionStatus = useNetInfo();

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCpa1yNJDYY_tBu80RTp2igQtnqx-ZSens",
    authDomain: "chat-app-afe1a.firebaseapp.com",
    projectId: "chat-app-afe1a",
    storageBucket: "chat-app-afe1a.appspot.com",
    messagingSenderId: "232187425400",
    appId: "1:232187425400:web:07941d089f7c9b9d0f338d"
  };

  let app, auth;

  // if (!getApps().length) statement fixes the "FirebaseError: Firebase: Error (auth/already-initialized)" error
  // initialize firebase app and authentication
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });
    } catch (error) {
      console.log("Error initializing app: " + error);
    }
  } else {
    app = getApp();
    auth = getAuth(app);
  }

  // Initialize Cloud Firestore and Cloud Storage and get a reference to the services
  const db = getFirestore(app);
  const storage = getStorage(app);

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>

      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          // use options prop to customize screen
          options={{ ...options, headerShown: false }}
        >
          {props => <Start auth={auth} {...props} />}
        </Stack.Screen>

        <Stack.Screen
          name="Chat"
          options={options} // hide the top navigation bar
        >
          {props => <Chat db={db} storage={storage} isConnected={connectionStatus.isConnected} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
