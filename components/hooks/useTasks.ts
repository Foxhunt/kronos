import firebase from "../../firebase/clientApp"
import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import {
    selectedClientDocRefAtom,
    selectedProjectDocRefAtom,
    userDocRefAtom
} from "../../store"

export default function useTasks() {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [client] = useAtom(selectedClientDocRefAtom)
    const [project] = useAtom(selectedProjectDocRefAtom)

    const [tasks, setTasks] = useState<firebase.firestore.DocumentSnapshot[]>([])

    useEffect(() => {
        if (userDocRef && client && project) {
            const unsubscribe = userDocRef
                .collection("tasks")
                .where("client", "==", client?.ref)
                .where("project", "==", project?.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setTasks(snapshot.docs)
                })

            return unsubscribe
        }
        if (userDocRef && client) {
            const unsubscribe = userDocRef
                .collection("tasks")
                .where("client", "==", client?.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setTasks(snapshot.docs)
                })

            return unsubscribe
        }

        const unsubscribe = userDocRef
            ?.collection("tasks")
            .orderBy("createdAt", "desc")
            .onSnapshot(snapshot => {
                setTasks(snapshot.docs)
            })

        return unsubscribe
    }, [userDocRef, client, project])

    return tasks
}
