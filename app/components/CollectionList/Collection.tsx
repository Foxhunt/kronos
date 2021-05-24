import firebase from "../../firebase/clientApp"
import { useState } from "react"
import styled from "styled-components"
import { lightFormat } from "date-fns"

import { Row, Cell } from "./CollectionComponents"

import IconAddSVG from "../../assets/svg/Icons/PLUS.svg"
import IconCancelSVG from "../../assets/svg/Icons/X.svg"

import Circle from "../Shared/Circle"

import { useCollectionOnce } from "react-firebase-hooks/firestore"
import EditableField from "../Shared/EditableField"
import { DropzoneRootProps, useDropzone } from "react-dropzone"
import uploadFile from "../../firebase/uploadFile"

const Container = styled.div<{ isDragActive: boolean }>`
    background-color: ${({ isDragActive }) => isDragActive ? "green" : "initial"};
`

const BoardName = styled.div<DropzoneRootProps>`
    padding: 0px 12px;
    background-color: ${({ isDragActive }) => isDragActive ? "blue" : "initial"};
`

type props = {
    collection: firebase.firestore.DocumentSnapshot
}

export default function Collection({ collection }: props) {

    const [boards, loading] = useCollectionOnce(
        collection?.ref.collection("boards").orderBy("createdAt", "desc")
    )

    const [showFiles, setShowFiles] = useState(false)

    const onDrop = async (files: File[]) => {
        const board = await collection?.ref.collection("boards").add({
            name: "new Board",
            collection: collection.ref,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

        for (const file of files) {
            uploadFile(file, collection.ref, board)
        }
    }
    const { getRootProps, isDragActive } = useDropzone({ onDrop })

    const createdAt = collection.get("createdAt", { serverTimestamps: "estimate" })
    const lastUpdatedAt = collection.get("lastUpdatedAt", { serverTimestamps: "estimate" })

    return <Container
        {...getRootProps()}
        isDragActive={isDragActive}
        onContextMenu={async event => {
            event.preventDefault()
            collection.ref.update({ deleted: !collection.get("deleted") })
        }}>
        <Row>
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
    </Container >
}

function Board({ board }: { board: firebase.firestore.DocumentSnapshot }) {
    const onDrop = async (files: File[]) => {
        const collection = board.get("collection")

        for (const file of files) {
            uploadFile(file, collection, board.ref)
        }
    }
    const { getRootProps, isDragActive } = useDropzone({ onDrop, noDragEventsBubbling: true })

    return <BoardName
        {...getRootProps({
            document: board,
            fieldName: "name",
            isDragActive
        })}>
        {board.get("name")}
    </BoardName>
}
