import firebase from "../../firebase/clientApp"
import { useState, useEffect } from "react"
import styled from "styled-components"
import Link from "next/link"

import { useAtom } from "jotai"
import {
    pathAtom,
    userDocRefAtom,
} from "../../store"

import FileGrid from "../FileGrid"

const Container = styled.div`
    display: grid;
    grid-template-columns: 200px 200px 200px 200px 200px auto 40px;
    grid-template-rows: 40px auto;
    grid-template-areas:
        "upload change client project task pin expand"
        "files files files files files files files";
`

const Uploaded = styled.div`

`

const Changed = styled.div`

`

const ClientName = styled.div`

`

const ProjectName = styled.div`

`

const TaskName = styled.div`

`

const Pined = styled.div`

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
                .limit(4)
                .onSnapshot(snapshot => {
                    setFiles(snapshot.docs)
                })

            return unsubscribe
        }
    }, [userDocRef, task])

    return (client && project) ?
        <Link href={"/files"}>
            <Container
                onClick={() => {
                    setPath([client, project, task])
                }}>
                <Uploaded>{task.get("createdAt").toDate().toDateString()}</Uploaded>
                <Changed>{task.get("lastUpdatedAt").toDate().toDateString()}</Changed>
                <ClientName>{client?.get("name")}</ClientName>
                <ProjectName>{project?.get("name")}</ProjectName>
                <TaskName>{task.get("name")}</TaskName>
                <Pined></Pined>
                <div
                    onClick={event => {
                        event.stopPropagation()
                        setShowFiles(!showFiles)
                    }}>
                    {showFiles ? "-" : "+"}
                </div>
                {showFiles && <FileGrid files={files} />}
            </Container>
        </Link> : null
}
