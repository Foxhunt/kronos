import firebase from "../firebase/clientApp"
import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import {
    orderOptions,
    userDocRefAtom
} from "../store"

import { sortByOptions } from "../components/Filter"

export function useBoards(
    client: firebase.firestore.DocumentSnapshot | undefined,
    project: firebase.firestore.DocumentSnapshot | undefined,
    task: firebase.firestore.DocumentSnapshot | undefined,
    { orderBy, orderDirection }: orderOptions = sortByOptions[0],
) {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [boards, setBoards] = useState<firebase.firestore.DocumentSnapshot[]>([])

    useEffect(() => {
        let query = userDocRef?.ref
            .collection("collections")
            .orderBy(orderBy, orderDirection)

        if (client) {
            query = query?.where("client", "==", client.ref)
        }

        if (project) {
            query = query?.where("project", "==", project.ref)
        }

        if (task) {
            query = query?.where("task", "==", task.ref)
        }

        const unsubscribe = query
            ?.onSnapshot(snapshot => {
                setBoards(snapshot.docs)
            })

        return unsubscribe
    }, [userDocRef, client, project, task])

    return boards
}
