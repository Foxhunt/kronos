import firebase from "../firebase/clientApp"
import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import {
    userDocRefAtom
} from "../store"

type orderOptions = {
    orderBy: string,
    orderDirection: "asc" | "desc"
}

export function useTasks(
    client: firebase.firestore.DocumentSnapshot | undefined,
    project: firebase.firestore.DocumentSnapshot | undefined,
    { orderBy, orderDirection }: orderOptions
) {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [tasks, setTasks] = useState<firebase.firestore.DocumentSnapshot[]>([])

    useEffect(() => {
        let query = userDocRef?.ref
            .collection("tasks")
            ?.orderBy(orderBy, orderDirection)

        if (client) {
            query = query?.where("client", "==", client.ref)
        }

        if (project) {
            query = query?.where("project", "==", project.ref)
        }

        const unsubscribe = query
            ?.onSnapshot(snapshot => {
                setTasks(snapshot.docs)
            })

        return unsubscribe
    }, [userDocRef, client, project, orderBy, orderDirection])

    return tasks
}
