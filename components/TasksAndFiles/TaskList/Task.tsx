import firebase from "../../../firebase/clientApp"
import { useState, useEffect } from "react"
import styled from "styled-components"

import { useAtom } from "jotai"
import {
    pathAtom,
} from "../../../store"

import FileGrid from "../FileGrid"
import useFiles from "../../hooks/useFiles"

const Container = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: 40px auto;
    grid-template-areas:
        "info info info info info info info"
        "files files files files files files files";

    & > div {
        display: flex;
        justify-content: center;
        align-items: center;
    }
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

    const files = useFiles()

    const [, setPath] = useAtom(pathAtom)

    const [showFiles, setShowFiles] = useState(false)

    return (client && project) ?
        <Container>
            <Uploaded>{task.get("createdAt")?.toDate().toDateString()}</Uploaded>
            <Changed>{task.get("lastUpdatedAt")?.toDate().toDateString()}</Changed>
            <ClientName
                onClick={() => {
                    setPath([client])
                }}>
                {client?.get("name")}
            </ClientName>
            <ProjectName
                onClick={() => {
                    setPath([client, project])
                }}>
                {project?.get("name")}
            </ProjectName>
            <TaskName
                onClick={() => {
                    setPath([client, project, task])
                }}>
                {task.get("name")}
            </TaskName>
            <Pined>
                <input
                    type="checkbox"
                    checked={task.get("pinned")}
                    onChange={event => {
                        task.ref.update({
                            pinned: event.target.checked
                        })
                    }} />
            </Pined>
            <div
                onClick={event => {
                    event.stopPropagation()
                    setShowFiles(!showFiles)
                }}>
                {showFiles ? "-" : "+"}
            </div>
            {showFiles && <FileGrid files={files} />}
        </Container> : null
}
