import firebase from "../../firebase/clientApp"
import { useRouter } from 'next/router'
import React, { useState, useEffect } from "react"
import styled from "styled-components"

import { useAtom } from "jotai"
import {
    selectedCollectionDocRefAtom,
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



    const [, setTask] = useAtom(selectedTaskDocRefAtom)
    const [, setBoard] = useAtom(selectedCollectionDocRefAtom)

    const files = useFiles(undefined, undefined, taskDocSnap, undefined, 3)
    const [showFiles, setShowFiles] = useState(false)

    return <Container
        onClick={async () => {
            setTask(taskDocSnap)
            setBoard(undefined)
            router.push("archive")
        }}>
        <Row>
            <Cell>
                {taskDocSnap.get("createdAt") && <div>
                    {taskDocSnap.get("createdAt")?.toDate().getDate()}
                .
                {taskDocSnap.get("createdAt")?.toDate()?.getMonth() + 1}
                .
                {taskDocSnap.get("createdAt")?.toDate().getFullYear()}
                </div>}
            </Cell>
            <Cell>
                {taskDocSnap.get("lastUpdatedAt") && <div>
                    {taskDocSnap.get("lastUpdatedAt")?.toDate().getDate()}
                .
                {taskDocSnap.get("lastUpdatedAt")?.toDate().getMonth() + 1}
                .
                {taskDocSnap.get("lastUpdatedAt")?.toDate().getFullYear()}
                </div>}
            </Cell>
            <Cell>
                <div>
                    {taskDocSnap?.get("name")}
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
    </Container>
}
