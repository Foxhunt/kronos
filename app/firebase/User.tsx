import firebase from "./clientApp"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { useAtom } from "jotai"

import {
    userDocRefAtom
} from "../store"

export default function User() {
    const router = useRouter()
    const [, setUserDoc] = useAtom(userDocRefAtom)

    useEffect(() => {
        // Listen authenticated user
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            try {
                if (user) {
                    // User is signed in.
                    // You could also look for the user doc in your Firestore (if you have one):
                    firebase.firestore().collection("users").doc(user.uid).onSnapshot(snapshot => {
                        setUserDoc(snapshot)
                    })

                    firebase.analytics().setUserId(user.uid)
                    firebase.analytics().logEvent(firebase.analytics.EventName.LOGIN, { method: firebase.auth.EmailAuthProvider.PROVIDER_ID })
                } else {
                    setUserDoc(undefined)
                    router.push("/login")
                }
            } catch (error) {
                // Most probably a connection error. Handle appropriately.
            } finally {
            }
        })

        // Unsubscribe auth listener on unmount
        return unsubscribe
    }, [])

    return null
}