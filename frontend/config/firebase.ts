// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBCS2Zkq4Osxod1Iu7bVh3EAG2au_tUfg8",
	authDomain: "whatsapp-clone-57a92.firebaseapp.com",
	projectId: "whatsapp-clone-57a92",
	storageBucket: "whatsapp-clone-57a92.appspot.com",
	messagingSenderId: "147043524729",
	appId: "1:147043524729:web:8df328303754ce772fb4a8"
}

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

const db = getFirestore(app)

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export { db, auth, provider }
