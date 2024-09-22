import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDxriGh0KrixUuZMFnm9rpNI1a6S57bgdQ",
  authDomain: "estep-car.firebaseapp.com",
  projectId: "estep-car",
  storageBucket: "estep-car.appspot.com",
  messagingSenderId: "483291394518",
  appId: "1:483291394518:web:b85475a19b0da399ecf477",
  measurementId: "G-3X4M4KQ6YN"
};

// Initialize Firebase
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();
  
// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({   
    prompt : "select_account "
});
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);