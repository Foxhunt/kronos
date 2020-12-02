import firebase from "../firebase/clientApp"
import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import {
    selectedClientDocRefAtom,
    selectedProjectDocRefAtom,
    userDocRefAtom
} from "../store"

export default function useTasks(
    orderBy: string,
    orderDirection: "asc" | "desc"
) {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [client] = useAtom(selectedClientDocRefAtom)
    const [project] = useAtom(selectedProjectDocRefAtom)

    const [tasks, setTasks] = useState<firebase.firestore.DocumentSnapshot[]>([])

    useEffect(() => {
        let query = userDocRef
            ?.collection("tasks")
            .where("pinned", "in", [true, false])

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
            ?.orderBy(orderBy, orderDirection)
            .onSnapshot(snapshot => {
                setTasks(snapshot.docs)
            })

        return unsubscribe
    }, [userDocRef, client, project, orderBy, orderDirection])

    return tasks
}
