import firebase from "../firebase/clientApp"
import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import {
    userDocRefAtom
} from "../store"

export function useClients() {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [clients, setClients] = useState<firebase.firestore.DocumentSnapshot[]>([])
    useEffect(() => {
        const unsubscribe = userDocRef
            ?.collection("clients")
            .orderBy("createdAt", "desc")
            .onSnapshot(snapshot => {
                setClients(snapshot.docs)
            })
        return () => {
            unsubscribe && unsubscribe()
            setClients([])
        }
    }, [userDocRef])

    return clients
}