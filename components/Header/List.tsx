import firebase from "../../firebase/clientApp"
import { useState } from "react"
import styled from "styled-components"

const Container = styled.div`
    background-color: white;
`

const Item = styled.div<{ selected?: boolean }>`
    height: 25px;
    border-top: black 1px solid;

    ${({ selected }) => selected ?
        `
        background-color: black;
        color: white;
        ` : ""
    }

    :hover {
        background-color: black;
        color: white;
    }
`

const NewItemInput = styled.input`
    padding: unset;
    width: 100%;
    height: 25px;

    border: none;
    border-top: black 1px solid;
`

type props = {
    name: string,
    selected: firebase.firestore.DocumentReference | undefined,
    items: firebase.firestore.DocumentSnapshot[] | undefined,
    onSelect: (docRef: firebase.firestore.DocumentReference | undefined) => void
    onAdd: (itemName: string) => void
}

export default function List({ name, selected, items, onSelect: onSelect, onAdd }: props) {
    const [addingItem, setAddingItem] = useState(false)
    const [newItemName, setNewItemName] = useState("")

    return <Container>
        <div>{name}</div>
        <Item
            onClick={() => setAddingItem(true)}>
            {addingItem ? "---" : "+++"}
        </Item>
        {
            addingItem &&
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
            </form>
        }
        {
            items?.map(item =>
                <Item
                    key={item.id}
                    selected={selected?.id === item.id}
                    onContextMenu={event => {
                        event.preventDefault()
                        item.ref.delete()
                    }}
                    onClick={() => onSelect(item.ref)}>
                    {item.get("name")}
                </Item>)
        }
    </Container>
}
