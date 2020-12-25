import firebase from "../../firebase/clientApp"
import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import styled from "styled-components"

import { useAtom } from "jotai"
import {
    pathAtom,
} from "../../store"

import FileGrid from "../FileGrid"
import { Row, Cell } from "./index"
import { useFiles } from "../../hooks"

const Container = styled.div``



type props = {
    taskDocSnap: firebase.firestore.DocumentSnapshot
}

export default function Collection({ taskDocSnap }: props) {
    const router = useRouter()
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

    const files = useFiles(client, project, taskDocSnap, undefined, 3)

    const [, setPath] = useAtom(pathAtom)

    const [showFiles, setShowFiles] = useState(false)

    return (client && project) ?
        <Container
            onClick={async () => {
                await setPath([client, project, taskDocSnap])
                router.push("archive")
            }}>
            <Row>
                <Cell>
                    {taskDocSnap.get("createdAt")?.toDate().getDate()}
                .
                {taskDocSnap.get("createdAt")?.toDate().getMonth() + 1}
                .
                {taskDocSnap.get("createdAt")?.toDate().getFullYear()}
                </Cell>
                <Cell>
                    {taskDocSnap.get("lastUpdatedAt")?.toDate().getDate()}
                .
                {taskDocSnap.get("lastUpdatedAt")?.toDate().getMonth() + 1}
                .
                {taskDocSnap.get("lastUpdatedAt")?.toDate().getFullYear()}
                </Cell>
                <Cell>
                    {client?.get("name")}
                </Cell>
                <Cell>
                    {project?.get("name")}
                </Cell>
                <Cell>
                    {taskDocSnap.get("name")}
                </Cell>
                <Cell>
                    <input
                        type="checkbox"
                        checked={taskDocSnap.get("pinned")}
                        onClick={event => event.stopPropagation()}
                        onChange={event => {
                            event.stopPropagation()
                            taskDocSnap.ref.update({
                                pinned: event.target.checked
                            })
                        }} />
                </Cell>
                <Cell
                    onClick={event => {
                        event.stopPropagation()
                        setShowFiles(!showFiles)
                    }}>
                    {showFiles ? "-" : "+"}
                </Cell>
            </Row>
            {showFiles && <FileGrid files={files} />}
        </Container> : null
}
