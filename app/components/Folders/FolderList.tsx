import firebase from "../../firebase/clientApp"
import styled from "styled-components"
import { useRef, useState } from "react"
import { useOfflineSearch, useScollIntoView } from "../../hooks"

const Container = styled.div`
    background-color: white;
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
    
    &:last-child {
        border-bottom: none;
    }
`

const Items = styled.div`
    max-height: calc(100% - 62px);
    overflow: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
`

const NewItemInput = styled.input`
    width: calc(100% - 5px);
    height: 30px;
    padding: unset;

    padding-left: 5px;

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
    items: firebase.firestore.DocumentSnapshot[]
    allowAdding: boolean
    onSelect: (docRef: firebase.firestore.DocumentSnapshot | undefined) => void
    onAdd: (itemName: string) => void
}

export default function FolderList({ name, selected, items, allowAdding, onSelect, onAdd }: props) {
    const [newItemName, setNewItemName] = useState("")

    const searchResult = useOfflineSearch({
        searchDocuments: items,
        searchText: newItemName,
        keys: ["name"]
    })

    const selectedItemRef = useRef<HTMLDivElement>(null)
    useScollIntoView(selectedItemRef)

    const renderItems = searchResult.length ? searchResult : items

    return <Container>
        <Item>{name}</Item>
        <form
            onSubmit={event => {
                event.preventDefault()
                if (allowAdding) {
                    onAdd(newItemName)
                    setNewItemName("")
                }
            }}>
            <NewItemInput
                type={"text"}
                autoFocus
                value={newItemName}
                onChange={event => {
                    setNewItemName(event.target.value)
                }} />
        </form>
        <Items>
            {newItemName !== "" &&
                <Item
                    onClick={() => {
                        allowAdding && onAdd(newItemName)
                    }}>
                    {allowAdding ? "click to create" : "select previous to create"}
                </Item>}
            {selected && <Item
                ref={selectedItemRef}
                key={selected.id}
                selected
                onContextMenu={event => {
                    event.preventDefault()
                    selected.ref.delete()
                }}
                onClick={() => {
                    onSelect(undefined)
                }}>
                {selected.get("name")}
            </Item>}
            {renderItems.map(item =>
                selected?.id !== item.id ? <Item
                    key={item.id}
                    onContextMenu={event => {
                        event.preventDefault()
                        item.ref.delete()
                    }}
                    onClick={() => {
                        onSelect(item)
                    }}>
                    {item.get("name")}
                </Item> : null
            )}
            {new Array(renderItems.length < 4 ? 4 - renderItems.length : 0)
                .fill("")
                .map((_item, index) => <Item key={index} />)}
        </Items>
    </Container>
}
