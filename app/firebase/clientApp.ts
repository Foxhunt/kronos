import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"
import "firebase/functions"
import "firebase/analytics"
import "firebase/performance"

const clientCredentials = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
}

// Check that `window` is in scope for the analytics module!
if (typeof window !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(clientCredentials)
    firebase.performance()

    if (location.hostname === "localhost") {
        firebase.auth().useEmulator("http://127.0.0.1:9099")
        firebase.functions().useEmulator("127.0.0.1", 5001)
        firebase.firestore().useEmulator("127.0.0.1", 8080)
        firebase.storage().useEmulator("127.0.0.1", 9199)
    }

    firebase.firestore().enablePersistence({
        synchronizeTabs: true
    })

    // To enable analytics. https://firebase.google.com/docs/analytics/get-started
    if ('measurementId' in clientCredentials) firebase.analytics()
}

export default firebase
