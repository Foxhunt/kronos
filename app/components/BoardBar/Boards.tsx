import firebase from "../../firebase/clientApp"
import { useState } from "react"
import { useAtom } from "jotai"
import styled from "styled-components"
import {
    boardsAtom,
    selectedClientDocRefAtom,
    selectedCollectionDocRefAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
    userDocRefAtom
} from "../../store"

const Container = styled.div`
    height: 100%;

    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    &::-webkit-scrollbar {
        display: none;
    }
`

const Item = styled.div<{ selected?: boolean }>`
    display: inline-flex;
    align-items: center;

    padding-left: 5px;
    
    border-left: black solid 1px;
    width: 150px;
    height: 100%;

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

const NewItemForm = styled.form`
    display: inline-flex;
    align-items: center;

    padding-left: 5px;
    
    border-left: black solid 1px;
    width: 150px;
    height: 100%;
`

const NewItemInput = styled.input`
    padding: unset;
    height: 100%;
    width: 100%;

    border: none; 
    border-width: 0px; 
    box-shadow: none;

    &:focus {
        outline: none!important;
    }
`

export default function Boards() {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [client] = useAtom(selectedClientDocRefAtom)
    const [project] = useAtom(selectedProjectDocRefAtom)
    const [task] = useAtom(selectedTaskDocRefAtom)

    const [selectedBoard, setBoard] = useAtom(selectedCollectionDocRefAtom)
    const [boards] = useAtom(boardsAtom)

    const [addingItem, setAddingItem] = useState(false)
    const [newItemName, setNewItemName] = useState("")

    return <Container
        onWheel={event => {
            event.currentTarget.scrollBy({ left: event.deltaY * 0.6 })
        }}>
        <Item
            selected={!selectedBoard}
            onPointerDown={() => {
                setBoard(undefined)
            }}>
            {userDocRef?.get("boards")}
        </Item>
        {boards?.map(board =>
            <Item
                key={board.id}
                selected={selectedBoard?.id === board.id}
                onContextMenu={event => {
                    event.preventDefault()
                    board.ref.delete()
                }}
                onPointerDown={() => {
                    if (board === selectedBoard) {
                        setBoard(undefined)
                    } else {
                        setBoard(board)
                    }
                }}>
                {board.get("name")}
            </Item>)
        }
        {addingItem &&
            <NewItemForm
                onSubmit={event => {
                    event.preventDefault()
                    userDocRef?.ref.collection("collections").add({
                        name: newItemName,
                        client: client?.ref,
                        project: project?.ref,
                        task: task?.ref,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
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
            </NewItemForm>
        }
        {task && !addingItem &&
            <Item
                onClick={() => setAddingItem(!addingItem)}>
                +++
            </Item>
        }
    </Container >
}
