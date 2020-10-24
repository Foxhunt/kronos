import firebase from "firebase"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAtom } from "jotai"
import {
    pathAtom,
} from "../../store"

type props = {
    task: firebase.firestore.DocumentSnapshot
}

export default function Task({ task }: props) {
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

    return (client && project) ? <Link href={"/files"}>
        <div onClick={() => {
            setPath([client, project, task])
        }}>
            {`${task.get("createdAt").toDate().toDateString()} ${task.get("lastUpdatedAt").toDate().toDateString()} ${client?.get("name")} ${project?.get("name")} ${task.get("name")}`}
        </div>
    </Link> : <></>
}
