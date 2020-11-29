import firebase from "../firebase/clientApp"
import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import {
    selectedClientDocRefAtom,
    selectedCollectionDocRefAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
    userDocRefAtom
} from "../store"

export default function useFiles() {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [client] = useAtom(selectedClientDocRefAtom)
    const [project] = useAtom(selectedProjectDocRefAtom)
    const [task] = useAtom(selectedTaskDocRefAtom)
    const [collection] = useAtom(selectedCollectionDocRefAtom)

    const [files, setFiles] = useState<firebase.firestore.DocumentSnapshot[]>([])

    useEffect(() => {
        const query = userDocRef
            ?.collection("files")
            .where("favorite", "in", [true, false])

        if (client && project && task && collection) {
            const unsubscribe = query
                ?.where("client", "==", client.ref)
                .where("project", "==", project.ref)
                .where("task", "==", task.ref)
                .where("collection", "==", collection.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setFiles(snapshot.docs)
                })

            return unsubscribe
        }
        if (client && project && task) {
            const unsubscribe = query
                ?.where("client", "==", client.ref)
                .where("project", "==", project.ref)
                .where("task", "==", task.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setFiles(snapshot.docs)
                })

            return unsubscribe
        }
        if (client && project) {
            const unsubscribe = query
                ?.where("client", "==", client.ref)
                .where("project", "==", project.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setFiles(snapshot.docs)
                })

            return unsubscribe
        }
        if (client) {
            const unsubscribe = query
                ?.where("client", "==", client.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setFiles(snapshot.docs)
                })

            return unsubscribe
        }

        const unsubscribe = query
            ?.orderBy("createdAt", "desc")
            .onSnapshot(snapshot => {
                setFiles(snapshot.docs)
            })

        return unsubscribe
    }, [userDocRef, client, project, task, collection])

    return files
}
