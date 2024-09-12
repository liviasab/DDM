import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  Auth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBo1ztc7FFn-9RS4Vm5HurAvyUmOqXA5A",
  authDomain: "enfor-app.firebaseapp.com",
  projectId: "enfor-app",
  storageBucket: "enfor-app.appspot.com",
  messagingSenderId: "476813303625",
  appId: "1:476813303625:web:4a28c1ceb9c9d8a28bc498",
};

const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

let auth: Auth;
try {
  if (!getAuth(app)._isInitialized) {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } else {
    auth = getAuth(app);
  }
} catch (error: any) {
  if (error.code === "auth/already-initialized") {
    auth = getAuth(app); 
  } else {
    throw error; 
  }
}

const db: Firestore = getFirestore(app);

export { auth, db };
