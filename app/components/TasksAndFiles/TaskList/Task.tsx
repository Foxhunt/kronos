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
`

const Item = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

type props = {
    taskDocSnap: firebase.firestore.DocumentSnapshot
}

export default function Task({ taskDocSnap }: props) {

    const [client, setClient] = useState<firebase.firestore.DocumentSnapshot>()
    const [project, setProject] = useState<firebase.firestore.DocumentSnapshot>()

    useEffect(() => {
        async function fetchData() {
            const [client, project] = await Promise.all([
                taskDocSnap.get("client").get(),
                taskDocSnap.get("project").get(),
            ])
            setClient(client)
            setProject(project)
        }
        fetchData()
    }, [taskDocSnap])

    const files = useFiles()

    const [, setPath] = useAtom(pathAtom)

    const [showFiles, setShowFiles] = useState(false)

    return (client && project) ?
        <Container>
            <Item>{taskDocSnap.get("createdAt")?.toDate().toDateString()}</Item>
            <Item>{taskDocSnap.get("lastUpdatedAt")?.toDate().toDateString()}</Item>
            <Item
                onClick={() => {
                    setPath([client])
                }}>
                {client?.get("name")}
            </Item>
            <Item
                onClick={() => {
                    setPath([client, project])
                }}>
                {project?.get("name")}
            </Item>
            <Item
                onClick={() => {
                    setPath([client, project, taskDocSnap])
                }}>
                {taskDocSnap.get("name")}
            </Item>
            <Item>
                <input
                    type="checkbox"
                    checked={taskDocSnap.get("pinned")}
                    onChange={event => {
                        taskDocSnap.ref.update({
                            pinned: event.target.checked
                        })
                    }} />
            </Item>
            <Item
                onClick={event => {
                    event.stopPropagation()
                    setShowFiles(!showFiles)
                }}>
                {showFiles ? "-" : "+"}
            </Item>
            {showFiles && <FileGrid files={files} />}
        </Container> : null
}
