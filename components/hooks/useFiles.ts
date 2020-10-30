import firebase from "../../firebase/clientApp"
import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import {
    selectedClientDocRefAtom,
    selectedCollectionDocRefAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
    userDocRefAtom
} from "../../store"

export default function useFiles() {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [client] = useAtom(selectedClientDocRefAtom)
    const [project] = useAtom(selectedProjectDocRefAtom)
    const [task] = useAtom(selectedTaskDocRefAtom)
    const [collection] = useAtom(selectedCollectionDocRefAtom)

    const [files, setFiles] = useState<firebase.firestore.DocumentSnapshot[]>([])

    useEffect(() => {
        if (userDocRef && client && project && task && collection) {
            const unsubscribe = userDocRef
                .collection("files")
                .where("client", "==", client?.ref)
                .where("project", "==", project?.ref)
                .where("task", "==", task?.ref)
                .where("collection", "==", collection?.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setFiles(snapshot.docs)
                })

            return unsubscribe
        }
        if (userDocRef && client && project && task) {
            const unsubscribe = userDocRef
                .collection("files")
                .where("client", "==", client?.ref)
                .where("project", "==", project?.ref)
                .where("task", "==", task?.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setFiles(snapshot.docs)
                })

            return unsubscribe
        }
        if (userDocRef && client && project) {
            const unsubscribe = userDocRef
                .collection("files")
                .where("client", "==", client?.ref)
                .where("project", "==", project?.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setFiles(snapshot.docs)
                })

            return unsubscribe
        }
        if (userDocRef && client) {
            const unsubscribe = userDocRef
                .collection("files")
                .where("client", "==", client?.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setFiles(snapshot.docs)
                })

            return unsubscribe
        }

        const unsubscribe = userDocRef
            ?.collection("files")
            .orderBy("createdAt", "desc")
            .onSnapshot(snapshot => {
                setFiles(snapshot.docs)
            })

        return unsubscribe
    }, [userDocRef, client, project, task, collection])

    return files
}
