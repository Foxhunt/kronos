import firebase from "../../firebase/clientApp"
import { useState } from "react"
import styled from "styled-components"

const Container = styled.div`
    max-height: 100%;
    overflow: auto;
`

const Item = styled.div<{ selected?: boolean }>`
    display: flex;
    align-items: center;

    height: 30px;
    
    padding-left: 5px;
    border-bottom: black 1px solid;

    ${({ selected }) => selected ?
        `
        background-color: black;
        color: white;
        ` : ""
    }
`

const NewItemInput = styled.input`
    width: 100%;
    height: 30px;
    padding: unset;

    border: none;
    border-bottom: black 1px solid;
    box-shadow: none;

    &:focus {
        outline: none!important;
    }
`

type props = {
    name: string
    selected: firebase.firestore.DocumentSnapshot | undefined
    items: firebase.firestore.DocumentSnapshot[] | undefined
    allowAdding: boolean
    onSelect: (docRef: firebase.firestore.DocumentSnapshot | undefined) => void
    onAdd: (itemName: string) => void
}

export default function FolderList({ name, selected, items, allowAdding, onSelect, onAdd }: props) {
    const [addingItem, setAddingItem] = useState(false)
    const [newItemName, setNewItemName] = useState("")

    return <Container>
        <Item>{name}</Item>
        {allowAdding &&
            addingItem ?
            <form
                onSubmit={event => {
                    event.preventDefault()
                    onAdd(newItemName)
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
            </form> : <Item
                onClick={() => setAddingItem(true)}>
                +++
        </Item>}
        {
            items?.map(item =>
                <Item
                    key={item.id}
                    selected={selected?.id === item.id}
                    onContextMenu={event => {
                        event.preventDefault()
                        item.ref.delete()
                    }}
                    onClick={() => onSelect(item)}>
                    {item.get("name")}
                </Item>)
        }
    </Container>
}
