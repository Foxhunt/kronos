import firebase from "../../firebase/clientApp"
import { useState, useEffect } from "react"
import Link from "next/link"

import { useAtom } from "jotai"
import {
    pathAtom,
    userDocRefAtom,
} from "../../store"

import FileGrid from "../FileGrid"

type props = {
    task: firebase.firestore.DocumentSnapshot
}

export default function Task({ task }: props) {
    const [showFiles, setShowFiles] = useState(false)
    const [userDocRef] = useAtom(userDocRefAtom)
    const [client, setClient] = useState<firebase.firestore.DocumentSnapshot>()
    const [project, setProject] = useState<firebase.firestore.DocumentSnapshot>()

    useEffect(() => {
        async function fetchData() {
            const [client, project] = await Promise.all([
                task.get("client").get(),
                task.get("project").get(),
            ])
            setClient(client)
            setProject(project)
        }
        fetchData()
    }, [task])

    const [, setPath] = useAtom(pathAtom)

    const [files, setFiles] = useState<firebase.firestore.DocumentSnapshot[]>([])

    useEffect(() => {
        if (userDocRef && task) {
            const unsubscribe = userDocRef
                .collection("files")
                .where("task", "==", task.ref)
                .orderBy("createdAt", "desc")
                .limit(4)
                .onSnapshot(snapshot => {
                    setFiles(snapshot.docs)
                })

            return unsubscribe
        }
    }, [userDocRef, task])

    return (client && project) ? <div>
        <Link href={"/files"}>
            <div
                onClick={() => {
                    setPath([client, project, task])
                }}>
                {`${task.get("createdAt").toDate().toDateString()} ${task.get("lastUpdatedAt").toDate().toDateString()} ${client?.get("name")} ${project?.get("name")} ${task.get("name")}`}
            </div>
        </Link>
        <div
            onClick={() => setShowFiles(!showFiles)}>{showFiles ? "-" : "+"}</div>
        {
            showFiles &&
            <FileGrid
                files={files} />
        }
    </div> : null
}
