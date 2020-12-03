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

export function useTasks({ orderBy, orderDirection }: orderOptions) {
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
