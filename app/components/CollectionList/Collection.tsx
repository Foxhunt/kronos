import firebase from "../../firebase/clientApp"
import { useRouter } from 'next/router'
import React, { useState, useEffect } from "react"
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

import IconAddSVG from "../../assets/svg/Icons/PLUS.svg"
import IconCancelSVG from "../../assets/svg/Icons/X.svg"

import Circle from "../Shared/Circle"

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
                    <div>
                        {taskDocSnap.get("createdAt")?.toDate().getDate()}
                .
                {taskDocSnap.get("createdAt")?.toDate().getMonth() + 1}
                .
                {taskDocSnap.get("createdAt")?.toDate().getFullYear()}
                    </div>
                </Cell>
                <Cell>
                    <div>
                        {taskDocSnap.get("lastUpdatedAt")?.toDate().getDate()}
                .
                {taskDocSnap.get("lastUpdatedAt")?.toDate().getMonth() + 1}
                .
                {taskDocSnap.get("lastUpdatedAt")?.toDate().getFullYear()}
                    </div>
                </Cell>
                <Cell>
                    <div>
                        {taskDocSnap?.get("clientName")}
                    </div>
                </Cell>
                <Cell>
                    <div>
                        {taskDocSnap?.get("projectName")}
                    </div>
                </Cell>
                <Cell>
                    <div>
                        {taskDocSnap.get("name")}
                    </div>
                </Cell>
                <Cell>
                    <Circle
                        fill={taskDocSnap.get("pinned") ? "#000000" : "#ffffff"}
                        stroke="#000000"
                        onClick={event => {
                            event.stopPropagation()
                            taskDocSnap.ref.update({
                                pinned: !taskDocSnap.get("pinned")
                            })
                        }} />
                </Cell>
                <Cell
                    onClick={event => {
                        event.stopPropagation()
                        setShowFiles(!showFiles)
                    }}>
                    {showFiles ? <IconCancelSVG /> : <IconAddSVG />}
                </Cell>
            </Row>
            {showFiles && <FileGrid files={files} />}
        </Container> : null
}
