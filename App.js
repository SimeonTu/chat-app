import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, initializeAuth, getReactNativePersistence, ReactNativeAsyncStorage } from "firebase/auth";
import { LogBox } from 'react-native';
import Start from './components/Start';
import Chat from './components/Chat';

// ignore warning message
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

// Create the navigator
const Stack = createNativeStackNavigator();

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

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCpa1yNJDYY_tBu80RTp2igQtnqx-ZSens",
    authDomain: "chat-app-afe1a.firebaseapp.com",
    projectId: "chat-app-afe1a",
    storageBucket: "chat-app-afe1a.appspot.com",
    messagingSenderId: "232187425400",
    appId: "1:232187425400:web:07941d089f7c9b9d0f338d"
  };


  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // authenticate firebase app
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

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
          {props => <Chat db={db} {...props} />}
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
