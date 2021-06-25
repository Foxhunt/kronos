import firebase from "../../firebase/clientApp"
import React, { useState } from "react"
import styled, { keyframes } from "styled-components"
import { lightFormat } from "date-fns"

import { Row, Cell } from "./CollectionComponents"

import IconAddSVG from "../../assets/svg/Icons/PLUS.svg"
import IconCancelSVG from "../../assets/svg/Icons/X.svg"

import Circle from "../Shared/Circle"

import { useCollection } from "react-firebase-hooks/firestore"
import EditableField from "../Shared/EditableField"
import { DropEvent, DropzoneRootProps, FileRejection, useDropzone } from "react-dropzone"
import uploadFile from "../../firebase/uploadFile"
import { useRouter } from "next/router"

const BoardName = styled.div<DropzoneRootProps>`
    min-width: fit-content;
    padding: 0px ${({ isDragActive }) => isDragActive ? 15 : 10}px;
    background-color: ${({ isDragActive }) => isDragActive ? "#c0c0c0" : "#d6d6d6"};
    
    transition: background-color 300ms ease,
                padding 500ms ease;
`

const shine = keyframes`
    from {
		background-position-x: 100%;
	}

    to {
		background-position-x: -100%;
	}
`

const NewBummyBoard = styled.div<DropzoneRootProps>`
    min-width: fit-content;
    padding: 0px 10px;

    background: linear-gradient(90deg,#ffffff 0%,#d6d6d6 40%,#d6d6d6 60%,#ffffff 100%);
    background-size: 200%;
    animation: ${shine} 2s cubic-bezier(0.24, -0.01, 0.65, 0.35) infinite;
`

type props = {
    collection: firebase.firestore.DocumentSnapshot
}

export default function Collection({ collection }: props) {
    const router = useRouter()

    const [boards, loading, error] = useCollection(
        collection?.ref.collection("boards").orderBy("createdAt", "desc")
    )

    if (error) {
        console.error(error)
    }

    const [showFiles, setShowFiles] = useState(false)

    const onDrop = async (files: File[]) => {
        const board = await collection?.ref.collection("boards").add({
            name: "new Board",
            collection: collection.ref,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

        for (const file of files) {
            uploadFile(file, collection.get("owner"), collection.ref, board)
        }
    }
    const { getRootProps, isDragActive } = useDropzone({ onDrop })

    const createdAt = collection.get("createdAt", { serverTimestamps: "estimate" })
    const lastUpdatedAt = collection.get("lastUpdatedAt", { serverTimestamps: "estimate" })

    return <Row
        {...getRootProps({
            isDragActive,
            onContextMenu: (event: React.MouseEvent) => {
                event.preventDefault()
                collection.ref.update({ deleted: !collection.get("deleted") })
            },
            onClick: () => {
                router.push(`/${collection.id}`)
            }
        })}>
        <Cell>
            {lightFormat(createdAt?.toDate(), "d.MM.y")}
        </Cell>
        <Cell>
            {lightFormat(lastUpdatedAt?.toDate(), "d.MM.y")}
        </Cell>
        <Cell>
            <EditableField
                document={collection}
                fieldName={"name"} />
        </Cell>
        <Cell>
            {loading && <div>loading ...</div>}
            {boards?.docs.map(board =>
                <Board
                    key={board.id}
                    board={board} />
            )}
            {isDragActive && <NewBummyBoard>new Board</NewBummyBoard>}
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
}

interface boardProps {
    board: firebase.firestore.DocumentSnapshot
}

function Board({ board }: boardProps) {
    const onDrop = async (files: File[], _fileRejections: FileRejection[], event: DropEvent) => {
        event.stopPropagation()
        const collection = board.get("collection")

        for (const file of files) {
            uploadFile(file, collection.get("owner"), collection.ref, board.ref)
        }
    }
    const { getRootProps, isDragActive } = useDropzone({ onDrop })

    return <BoardName
        {...getRootProps({
            isDragActive
        })}>
        {board.get("name")}
    </BoardName>
}
