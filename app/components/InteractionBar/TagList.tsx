import firebase from "../../firebase/clientApp"
import { useRef, useState } from "react"
import { useClickedOutside, useTags } from "../../hooks"

import styled from "styled-components"

import { useAtom } from "jotai"
import { userDocRefAtom } from "../../store"

const Container = styled.div`
    position: absolute;
    z-index: 1;
    background-color: white;
`

const NewItemInput = styled.input`
    padding: unset;

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
    onHide: () => void
    onSelectTag: (tag: firebase.firestore.DocumentSnapshot) => void
}

export default function TagList({ onSelectTag, onHide }: props) {
    const [userDocRef] = useAtom(userDocRefAtom)
    const tags = useTags()

    const [addingItem, setAddingItem] = useState(false)
    const [newItemName, setNewItemName] = useState("")

    const containerRef = useRef<HTMLDivElement>(null)
    useClickedOutside(containerRef, () => onHide())

    return <Container
        ref={containerRef}>
        {addingItem ?
            <form
                onSubmit={event => {
                    event.preventDefault()
                    const tagRef = userDocRef?.collection("tags").doc(newItemName)
                    tagRef?.set({ name: newItemName })
                    setAddingItem(false)
                    setNewItemName("")
                }}>
                <NewItemInput
                    type={"text"}
                    autoFocus
                    value={newItemName}
                    onBlur={() => setAddingItem(false)}
                    onChange={event => {
                        setNewItemName(event.target.value)
                    }} />
            </form>
            :
            <Tag
                onClick={event => {
                    event.stopPropagation()
                    setAddingItem(true)
                }}>
                +++
            </Tag>
        }
        {tags.map(tag =>
            <Tag
                onClick={event => {
                    event.stopPropagation()
                    onSelectTag(tag)
                }}
                key={tag.id}>
                {tag.get("name")}
            </Tag>
        )}
    </Container>
}
