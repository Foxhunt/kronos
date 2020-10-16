import firebase from "firebase"
import { useEffect } from "react"
import { useAtom } from "jotai"

import { userDocAtom } from "../store"

export default function User() {
    const [, setUserDoc] = useAtom(userDocAtom)

    useEffect(() => {
        // Listen authenticated user
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            try {
                if (user) {
                    // User is signed in.
                    // You could also look for the user doc in your Firestore (if you have one):
                    const userDocRef = firebase.firestore().collection("users").doc(user.uid)
                    setUserDoc(userDocRef)
                    firebase.analytics().setUserId(user.uid)
                    firebase.analytics().logEvent(firebase.analytics.EventName.LOGIN, { method: firebase.auth.EmailAuthProvider.PROVIDER_ID })
                } else {
                    setUserDoc(null)
                }
            } catch (error) {
                // Most probably a connection error. Handle appropriately.
            } finally {
            }
        })

        // Unsubscribe auth listener on unmount
        return unsubscribe
    }, [])

    return <></>
}