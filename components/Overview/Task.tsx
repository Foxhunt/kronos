import firebase from "../../firebase/clientApp"
import { useState, useEffect, useMemo } from "react"
import styled from "styled-components"
import Link from "next/link"
import { useAtom } from "jotai"
import {
    pathAtom,
    userDocRefAtom,
} from "../../store"

import FileComponent from "../Files/file"

const Container = styled.div`
    text-align: center;
    outline: none;
    position: relative;
    grid-area: content;

    padding: 16px;

    display: grid;
    grid-template-columns: repeat(auto-fit, 300px);
    grid-template-rows: repeat(auto-fit, 300px);
    gap: 16px;
    justify-items: start;
    align-items: start;
`

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
                .onSnapshot(snapshot => {
                    setFiles(snapshot.docs)
                })

            return unsubscribe
        }
    }, [userDocRef, task])

    const fileList = useMemo(() => files.map(
        fileSnapshot =>
            <FileComponent
                key={fileSnapshot.id}
                fullPath={fileSnapshot.get("fullPath")} />
    ), [files])

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
            <Container>
                {fileList}
            </Container>
        }
    </div> : null
}
