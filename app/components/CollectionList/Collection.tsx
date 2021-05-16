import firebase from "../../firebase/clientApp"
import { useRouter } from 'next/router'
import React, { useState } from "react"
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
import { useCollection } from "react-firebase-hooks/firestore"

const Container = styled.div``

type props = {
    collection: firebase.firestore.DocumentSnapshot
}

export default function Collection({ collection }: props) {
    const router = useRouter()

    const [boards, loading] = useCollection(
        collection?.ref.collection("boards").orderBy("createdAt", "desc")
    )

    const [, setTask] = useAtom(selectedTaskDocRefAtom)
    const [, setBoard] = useAtom(selectedCollectionDocRefAtom)

    const files = useFiles(undefined, undefined, collection, undefined, 3)
    const [showFiles, setShowFiles] = useState(false)

    return <Container
        onClick={async () => {
            setTask(collection)
            setBoard(undefined)
            router.push("archive")
        }}
        onContextMenu={async event => {
            event.preventDefault()
            await collection.ref.delete()
            const boards = await collection.ref.collection("boards").get()

            const batch = firebase.firestore().batch()

            boards.docs.forEach(board => {
                batch.delete(board.ref)
            })

            await batch.commit()
        }}>
        <Row>
            <Cell>
                {collection.get("createdAt") && <div>
                    {collection.get("createdAt")?.toDate().getDate()}
                .
                {collection.get("createdAt")?.toDate()?.getMonth() + 1}
                .
                {collection.get("createdAt")?.toDate().getFullYear()}
                </div>}
            </Cell>
            <Cell>
                {collection.get("lastUpdatedAt") && <div>
                    {collection.get("lastUpdatedAt")?.toDate().getDate()}
                .
                {collection.get("lastUpdatedAt")?.toDate().getMonth() + 1}
                .
                {collection.get("lastUpdatedAt")?.toDate().getFullYear()}
                </div>}
            </Cell>
            <Cell>
                <div>
                    {collection?.get("name")}
                </div>
            </Cell>
            <Cell>
                <div>
                    {loading && <div>loading ...</div>}
                    {
                        boards?.docs.length ?
                            boards.docs.map(board => <span key={board.id}>{board.get("name")} </span>)
                            :
                            <></>
                    }
                </div>
            </Cell>
            <Cell>
                <Circle
                    fill={collection.get("pinned") ? "#000000" : "#ffffff"}
                    stroke="#000000"
                    onClick={event => {
                        event.stopPropagation()
                        collection.ref.update({
                            pinned: !collection.get("pinned")
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
