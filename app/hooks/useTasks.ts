import firebase from "../firebase/clientApp"
import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import {
    selectedClientDocRefAtom,
    selectedProjectDocRefAtom,
    userDocRefAtom
} from "../store"

export default function useTasks() {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [client] = useAtom(selectedClientDocRefAtom)
    const [project] = useAtom(selectedProjectDocRefAtom)

    const [tasks, setTasks] = useState<firebase.firestore.DocumentSnapshot[]>([])

    useEffect(() => {
        const query = userDocRef
            ?.collection("tasks")
            .where("pinned", "in", [true, false])

        if (client && project) {
            const unsubscribe = query
                ?.where("client", "==", client.ref)
                .where("project", "==", project.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setTasks(snapshot.docs)
                })

            return unsubscribe
        }
        if (client) {
            const unsubscribe = query
                ?.where("client", "==", client.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setTasks(snapshot.docs)
                })

            return unsubscribe
        }

        const unsubscribe = query
            ?.orderBy("createdAt", "desc")
            .onSnapshot(snapshot => {
                setTasks(snapshot.docs)
            })

        return unsubscribe
    }, [userDocRef, client, project])

    return tasks
}
