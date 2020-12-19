import firebase from "../firebase/clientApp"
import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import {
    userDocRefAtom
} from "../store"

export function useFiles(
    client?: firebase.firestore.DocumentSnapshot,
    project?: firebase.firestore.DocumentSnapshot,
    task?: firebase.firestore.DocumentSnapshot,
    collection?: firebase.firestore.DocumentSnapshot,
    limit: number = Infinity,
    favorites: boolean = false
) {
    const [userDocRef] = useAtom(userDocRefAtom)

    const [files, setFiles] = useState<firebase.firestore.DocumentSnapshot[]>([])

    useEffect(() => {
        let query = userDocRef
            ?.collection("files")
            .where("favorite", "in", [true, favorites])

        if (client && project && task && collection) {
            query = query
                ?.where("client", "==", client.ref)
                .where("project", "==", project.ref)
                .where("task", "==", task.ref)
                .where("collection", "==", collection.ref)
        }
        if (client && project && task) {
            query = query
                ?.where("client", "==", client.ref)
                .where("project", "==", project.ref)
                .where("task", "==", task.ref)
        }
        if (client && project) {
            query = query
                ?.where("client", "==", client.ref)
                .where("project", "==", project.ref)
        }
        if (client) {
            query = query
                ?.where("client", "==", client.ref)
        }

        const unsubscribe = query
            ?.orderBy("createdAt", "desc")
            .limit(limit)
            .onSnapshot(snapshot => {
                setFiles(snapshot.docs)
            })

        return unsubscribe
    }, [userDocRef, client, project, task, collection])

    return files
}
