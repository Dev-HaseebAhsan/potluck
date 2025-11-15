// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Platform } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics } from "firebase/analytics";
// For web version
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
// For mobile version
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0e6PLaOiM3m2VegYc3ZWa2EL27fG6RZ0",
  authDomain: "potluck-9f246.firebaseapp.com",
  projectId: "potluck-9f246",
  storageBucket: "potluck-9f246.firebasestorage.app",
  messagingSenderId: "580552292837",
  appId: "1:580552292837:web:13b85922ea335aab02170c",
  measurementId: "G-QSQSBMRQKL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}
export { auth, analytics };