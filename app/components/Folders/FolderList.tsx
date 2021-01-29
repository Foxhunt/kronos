import firebase from "../../firebase/clientApp"
import styled from "styled-components"
import { useRef, useState } from "react"
import { useClickedOutside, useOfflineSearch, useScollIntoView } from "../../hooks"
import { useAtom } from "jotai"
import { filesToUploadAtom, userDocRefAtom } from "../../store"

import { ItemList, Item } from "../Shared/ItemList"

const Container = styled.div`
`

const ItemForm = styled.form`
    height: 30px;
    border-bottom: black 1px solid;
`

const ItemInput = styled.input`
    width: calc(100% - 5px);
    padding: unset;

    padding-left: 5px;

    border: none;
    box-shadow: none;

    &:focus {
        outline: none!important;
    }
`

type props = {
    name: string
    previousName?: string
    selected: firebase.firestore.DocumentSnapshot | undefined
    items: firebase.firestore.DocumentSnapshot[]
    allowAdding: boolean
    onSelect: (docRef: firebase.firestore.DocumentSnapshot | undefined) => void
    onAdd: (itemName: string) => void
}

export default function FolderList({ name, previousName, selected, items, allowAdding, onSelect, onAdd }: props) {
    const [userDocRef] = useAtom(userDocRefAtom)

    const [newItemName, setNewItemName] = useState("")

    const searchResult = useOfflineSearch({
        searchDocuments: items,
        searchText: newItemName,
        keys: ["name"]
    })

    const [isAdditingLevelName, setIsAdditingLevelName] = useState(false)
    const levelNameInputRef = useRef<HTMLInputElement>(null)
    useClickedOutside(levelNameInputRef, () => {
        setIsAdditingLevelName(false)
    })

    const renderItems = []

    if (newItemName !== "") {
        renderItems.push(<Item
            key={"click to create"}
            onClick={() => {
                if (allowAdding) {
                    onAdd(newItemName)
                    setNewItemName("")
                }
            }}>
            {allowAdding ? "click to create" : `select ${previousName && userDocRef?.get(previousName)} to create`}
        </Item >)
    }

    const selectedItemRef = useRef<HTMLDivElement>(null)
    useScollIntoView(selectedItemRef)

    renderItems.push(...(searchResult.length ? searchResult : items).map(item =>
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
        </Item> : <Item
            ref={selectedItemRef}
            key={selected.id}
            selected
            onContextMenu={event => {
                event.preventDefault()
                onSelect(undefined)
                selected.ref.delete()
            }}
            onClick={() => {
                onSelect(selected)
            }}>
                {selected.get("name")}
            </Item>
    ))

    const [filesToUpload] = useAtom(filesToUploadAtom)

    return <Container>
        {
            isAdditingLevelName ?
                <ItemForm
                    onSubmit={event => {
                        event.preventDefault()
                        setIsAdditingLevelName(false)
                    }}>
                    <ItemInput
                        autoFocus
                        ref={levelNameInputRef}
                        type={"text"}
                        value={userDocRef?.get(name)}
                        onChange={event => {
                            userDocRef?.ref.update({ [name]: event.target.value })
                        }} />
                </ItemForm>
                :
                <Item
                    onDoubleClick={event => {
                        event.preventDefault()
                        setIsAdditingLevelName(true)
                    }}>
                    {
                        filesToUpload.length > 0 && !selected ?
                            `Select a ${userDocRef?.get(name)} to complete upload.`
                            :
                            userDocRef?.get(name)
                    }
                </Item>
        }
        <ItemForm
            onSubmit={event => {
                event.preventDefault()
                if (allowAdding) {
                    onAdd(newItemName)
                    setNewItemName("")
                }
            }}>
            <ItemInput
                type={"text"}
                autoFocus
                placeholder={"search/create"}
                value={newItemName}
                onChange={event => {
                    setNewItemName(event.target.value)
                }} />
        </ItemForm>
        <ItemList
            lenght={4}>
            {renderItems}
        </ItemList>
    </Container>
}
