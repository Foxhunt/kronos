import firebase from "../firebase/clientApp"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useAtom } from "jotai"

import {
    userDocRefAtom
} from "../store"

export default function User() {
    const router = useRouter()

    const [authUser, setAuthUser] = useState<firebase.User>()
    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                setAuthUser(user)
                firebase.analytics().setUserId(user.uid)
                firebase.analytics().logEvent(firebase.analytics.EventName.LOGIN, { method: firebase.auth.EmailAuthProvider.PROVIDER_ID })
            } else {
                setAuthUser(undefined)
                router.push("/login")
            }
        })
        return unsubscribe
    }, [])

    const [, setUserDocSnap] = useAtom(userDocRefAtom)
    useEffect(() => {
        let unsubscribe

        if (authUser) {
            const userDoc = firebase.firestore().collection("users").doc(authUser.uid)
            unsubscribe = userDoc
                .onSnapshot(snapshot => {
                    setUserDocSnap(snapshot)
                })
        } else {
            setUserDocSnap(undefined)
        }

        return unsubscribe
    }, [authUser])

    return null
}