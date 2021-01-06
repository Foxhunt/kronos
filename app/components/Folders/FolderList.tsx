import firebase from "../../firebase/clientApp"
import styled from "styled-components"
import { useEffect, useRef, useState } from "react"
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

    const renderItems = searchResult.length ? searchResult : items

    const selectedItemRef = useRef<HTMLDivElement>(null)
    useScollIntoView(selectedItemRef)

    const [canScrollUp, setCanScrollUp] = useState(false)
    const [canScrollDown, setCanScrollDown] = useState(false)
    const ItemsRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (ItemsRef.current) {
            setCanScrollUp(ItemsRef.current.scrollTop >= 31)
            setCanScrollDown(ItemsRef.current.scrollHeight - ItemsRef.current.scrollTop - ItemsRef.current.clientHeight >= 31)
        }
    }, [ItemsRef.current, renderItems])

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
        <Items
            ref={ItemsRef}
            onScroll={event => {
                setCanScrollUp(event.currentTarget.scrollTop >= 31)
                setCanScrollDown(event.currentTarget.scrollHeight - event.currentTarget.scrollTop - event.currentTarget.clientHeight >= 31)
            }}>
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
