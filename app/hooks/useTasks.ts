import firebase from "../firebase/clientApp"
import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import {
    userDocRefAtom
} from "../store"

export default function useTasks(
    orderBy: string,
    orderDirection: "asc" | "desc"
) {
    const [userDocRef] = useAtom(userDocRefAtom)

    const [tasks, setTasks] = useState<firebase.firestore.DocumentSnapshot[]>([])

    useEffect(() => {
        const unsubscribe = userDocRef
            ?.collection("tasks")
            ?.orderBy(orderBy, orderDirection)
            ?.onSnapshot(snapshot => {
                setTasks(snapshot.docs)
            })

        return unsubscribe
    }, [userDocRef, orderBy, orderDirection])

    return tasks
}
