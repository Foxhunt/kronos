import firebase from "../../firebase/clientApp"
import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import styled from "styled-components"

import { useAtom } from "jotai"
import {
    selectedClientDocRefAtom,
    selectedCollectionDocRefAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
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
    const [taskClient, setTaskClient] = useState<firebase.firestore.DocumentSnapshot>()
    const [taskProject, setTaskProject] = useState<firebase.firestore.DocumentSnapshot>()

    useEffect(() => {
        async function fetchData() {
            const [client, project] = await Promise.all([
                taskDocSnap.get("client").get(),
                taskDocSnap.get("project").get(),
            ])
            setTaskClient(client)
            setTaskProject(project)
        }
        fetchData()
    }, [taskDocSnap])

    const [, setClient] = useAtom(selectedClientDocRefAtom)
    const [, setProject] = useAtom(selectedProjectDocRefAtom)
    const [, setTask] = useAtom(selectedTaskDocRefAtom)
    const [, setBoard] = useAtom(selectedCollectionDocRefAtom)

    const files = useFiles(taskClient, taskProject, taskDocSnap, undefined, 3)
    const [showFiles, setShowFiles] = useState(false)

    return (taskClient && taskProject) ?
        <Container
            onClick={async () => {
                setClient(taskClient)
                setProject(taskProject)
                setTask(taskDocSnap)
                setBoard(undefined)
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
                    {taskDocSnap?.get("clientName")}
                </Cell>
                <Cell>
                    {taskDocSnap?.get("projectName")}
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
