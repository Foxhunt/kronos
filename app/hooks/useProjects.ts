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
        let query = userDocRef?.ref
            .collection("projects")
            .orderBy("createdAt", "desc")

        if (client) {
            query = query?.where("client", "==", client.ref)
        }

        const unsubscribe = query
            ?.onSnapshot(snapshot => {
                setProjects(snapshot.docs)
            })

        return unsubscribe
    }, [userDocRef, client])

    return projects
}
