import firebase from "../../firebase/clientApp"
import { useState } from "react"
import styled from "styled-components"

import FileGrid from "../FileGrid"
import { Row, Cell } from "./CollectionComponents"

import IconAddSVG from "../../assets/svg/Icons/PLUS.svg"
import IconCancelSVG from "../../assets/svg/Icons/X.svg"

import Circle from "../Shared/Circle"

import { useCollection } from "react-firebase-hooks/firestore"
import { useFiles } from "../../hooks"
import EditableField from "../Shared/EditableField"

const Container = styled.div``

type props = {
    collection: firebase.firestore.DocumentSnapshot
}

export default function Collection({ collection }: props) {

    const [boards, loading] = useCollection(
        collection?.ref.collection("boards").orderBy("createdAt", "desc")
    )

    const files = useFiles(undefined, undefined, collection, undefined, 3)
    const [showFiles, setShowFiles] = useState(false)

    return <Container
        onContextMenu={async event => {
            event.preventDefault()
            collection.ref.update({ deleted: true })
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
                <EditableField
                    document={collection}
                    fieldName={"name"} />
            </Cell>
            <Cell>
                {loading && <div>loading ...</div>}
                {boards?.docs.map(board =>
                    <EditableField
                        key={board.id}
                        document={board}
                        fieldName={"name"} />
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
        {showFiles && <FileGrid files={files} />}
    </Container >
}
