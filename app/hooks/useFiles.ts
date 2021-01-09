import firebase from "../firebase/clientApp"
import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import {
    orderOptions,
    userDocRefAtom
} from "../store"

export function useFiles(
    client?: firebase.firestore.DocumentSnapshot,
    project?: firebase.firestore.DocumentSnapshot,
    task?: firebase.firestore.DocumentSnapshot,
    collection?: firebase.firestore.DocumentSnapshot,
    limit: number = Infinity,
    { orderBy, orderDirection }: orderOptions = { orderBy: "createdAt", orderDirection: "desc" },
    favorite: boolean = false,
    marked: boolean = false,
    tags?: string[]
) {
    const [userDocRef] = useAtom(userDocRefAtom)

    const [files, setFiles] = useState<firebase.firestore.DocumentSnapshot[]>([])

    useEffect(() => {
        let query = userDocRef?.ref
            .collection("files")
            ?.orderBy(orderBy, orderDirection)
            .limit(limit)

        if (tags?.length) {
            query = query?.where("tags", "array-contains-any", tags)
        }

        if (favorite) {
            query = query?.where("favorite", "==", favorite)
        }

        if (marked) {
            query = query?.where("marked", "==", marked)
        }

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
            ?.onSnapshot(snapshot => {
                setFiles(snapshot.docs)
            })

        return unsubscribe
    }, [userDocRef, client, project, task, collection, limit, orderBy, orderDirection, favorite, marked, tags])

    return files
}
