import firebase from "../../firebase/clientApp"
import { useRef, useState } from "react"
import { useClickedOutside, useOfflineSearch, useTags } from "../../hooks"

import styled from "styled-components"

import { useAtom } from "jotai"
import { userDocRefAtom } from "../../store"

const Container = styled.div`
    position: absolute;
    top: 30px;
    
    z-index: 1;
    background-color: white;

    width: 170px;
`

const NewItemForm = styled.form`
    height: 29px;
    border: black 1px solid;
    
    padding-left: 8px;
`

const NewItemInput = styled.input`
    padding: unset;

    width: 100%;
    height: 100%;

    font-family: "FuturaNowHeadline-Bd";

    border: none;
    box-shadow: none;

    &:focus {
        outline: none!important;
    }
`

const Tag = styled.div`
    height: 31px;
    border: black 1px solid;

    padding-left: 8px;
    padding-bottom: 2px;
    box-sizing: border-box;

    display: flex;
    align-items: center;
`

const TagText = styled.div`
    line-height: initial;
    padding-bottom: 2px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
        ref={containerRef}
        onPointerDown={event => event.stopPropagation()}>
        <NewItemForm
            onSubmit={event => {
                event.preventDefault()
                const tagRef = userDocRef?.ref.collection("tags").doc(newItemName)
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
        </NewItemForm>
        {searchResult.length === 0 &&
            newItemName !== "" &&
            <Tag
                onPointerDown={event => {
                    event.preventDefault()
                    const tagRef = userDocRef?.ref.collection("tags").doc(newItemName)
                    tagRef?.set({ name: newItemName })
                    setNewItemName("")
                }}>
                not found click to create
            </Tag>}
        {(newItemName !== "" ? searchResult : tags).map(tags =>
            <Tag
                onPointerDown={async event => {
                    event.stopPropagation()
                    const tag = await userDocRef?.ref.collection("tags").doc(tags.get("name")).get()
                    tag && onSelectTag(tag)
                }}
                key={tags.id}>
                <TagText>
                    {tags.get("name")}
                </TagText>
            </Tag>
        )}
    </Container >
}
