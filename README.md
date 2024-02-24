# Chat App

## A mobile chat app built with React Native that allows users to choose a name or anonymously send messages in a group chat room and share images or their location.

![Screenshots from the app](https://i.imgur.com/RBM8qon.png)

## Features
- Chat room with options for sending images and location
- Register with a name or as an anonymous user
- Light and Dark UI options
- Ability to view messages while offline

## How to set up:
- Clone the repository onto your computer.

- Install the latest Node.js LTS release on your device.

- Setup Expo Go
  - Install the Expo CLI and package on your device by running the command `npm install expo` in your terminal.
  - Download the Expo Go app on the mobile device where you plan to run the app.
  - Log in to Expo Go or sign up if you don't have an account.

- Setup a database on Google Firebase and connect to the locally hosted app
  - Go to Google Firebase and log in with your Google account.
  - Create a new project.
  - Open the project and select "Firestore Database" from the Build tab on the left of the menu, then select "Create Database" and choose any region you want. Select the "Start in production mode" option.
  - Go to the "Rules" tab and change `allow read, write: if false;` to `allow read, write: if true;`, then publish the change. This will allow the app to read from and write to the database.
  - Navigate to the "Project Overview" and register the app as a web app.
  - Navigate to "Project Settings" by clicking the gear icon next to "Project Overview". In the section titled "SDK setup and configuration" copy the text in `const firebaseConfig = {...};`.
  - Open the Chat App repository you cloned earlier in your IDE, open App.js, and replace the code found in the firebaseConfig variable with your own.
 
- Setup anonymous user authorization in Google Firebase
  - Select "Authentication" from the "Build" tab in your Firebase console.
  - In the "Sign-in Providers" section enable the anonymous sign-in method provider.

- Navigate to the root directory of the project in your terminal and run `npm install` to install project dependencies.
- Run the terminal command `npx expo start` in the root directory of the project and open Expo Go on your mobile device. Log in to Expo Go if you haven't already, and select the server you just started.

## Technologies used:
- React Native - AsyncStorage, react-native-maps
- Expo - ImagePicker, MediaLibrary, Location
- Google Firebase - Firestore, Storage
- GiftedChat library

Note: see the package.json file for a full list of dependencies
