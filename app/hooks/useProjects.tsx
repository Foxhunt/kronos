import firebase from "../firebase/clientApp"
import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import {
    userDocRefAtom
} from "../store"

export function useProjects(client: firebase.firestore.DocumentSnapshot | undefined) {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [projects, setProjects] = useState<firebase.firestore.DocumentSnapshot[]>([])
    useEffect(() => {
        if (userDocRef && client) {
            const unsubscribe = userDocRef
                .collection("projects")
                .where("client", "==", client.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setProjects(snapshot.docs)
                })
            return () => {
                unsubscribe()
                setProjects([])
            }
        }
    }, [userDocRef, client])

    return projects
}
