import firebase from "../../firebase/clientApp"
import { useRef, useState } from "react"
import { useClickedOutside, useOfflineSearch, useTags } from "../../hooks"

import styled from "styled-components"

import { useAtom } from "jotai"
import { userDocRefAtom } from "../../store"

const Container = styled.div`
    position: absolute;
    z-index: 1;
    background-color: white;

    width: 170px;
`

const NewItemInput = styled.input`
    padding: unset;

    height: 25px;
    width: 100%;

    border: none;
    border-bottom: black 1px solid;
    box-shadow: none;

    &:focus {
        outline: none!important;
    }
`

const Tag = styled.div`

`

type props = {
    onHide: (event: MouseEvent) => void
    onSelectTag: (tag: firebase.firestore.DocumentSnapshot) => void
}

export default function TagList({ onSelectTag, onHide }: props) {
    const [userDocRef] = useAtom(userDocRefAtom)

    const tags = useTags()

    const [newItemName, setNewItemName] = useState("")

    const searchResult = useOfflineSearch({
        searchDocuments: tags,
        searchText: newItemName,
        keys: ["name"]
    })

    const containerRef = useRef<HTMLDivElement>(null)
    useClickedOutside(containerRef, onHide)

    return <Container
        ref={containerRef}>
        <form
            onSubmit={event => {
                event.preventDefault()
                const tagRef = userDocRef?.collection("tags").doc(newItemName)
                tagRef?.set({ name: newItemName })
                setNewItemName("")
            }}>
            <NewItemInput
                type={"text"}
                autoFocus
                value={newItemName}
                onChange={event => {
                    setNewItemName(event.target.value)
                }} />
        </form>
        {searchResult.length === 0 &&
            newItemName !== "" &&
            <Tag
                onPointerDown={event => {
                    event.preventDefault()
                    const tagRef = userDocRef?.collection("tags").doc(newItemName)
                    tagRef?.set({ name: newItemName })
                    setNewItemName("")
                }}>
                not found click to create
            </Tag>}
        {(newItemName !== "" ? searchResult : tags).map(tags =>
            <Tag
                onPointerDown={async event => {
                    event.stopPropagation()
                    const tag = await userDocRef?.collection("tags").doc(tags.get("name")).get()
                    tag && onSelectTag(tag)
                }}
                key={tags.id}>
                {tags.get("name")}
            </Tag>
        )}
    </Container >
}
