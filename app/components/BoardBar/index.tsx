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
    height: 40px;
    flex-shrink: 0;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;

    align-items: center;
    
    gap: 16px;
    padding: 0px 16px;
    
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    &::-webkit-scrollbar {
        display: none;
    }
`

const Item = styled.div<{ selected?: boolean }>`
    flex: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    min-width: 150px;
    height: 30px;

    padding: 0px 5px;
    border: black solid 1px;
    border-radius: 20px;

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

    & > div {
        line-height: initial;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
`

const NewItemForm = styled.form`
    flex-grow: 1;
    flex-basis: 0;

    display: inline-flex;
    align-items: center;

    min-width: 150px;
    height: 30px;
        
    padding: 0px 5px;
    border: black solid 1px;
    border-radius: 20px;
    
    overflow: hidden;
`

const NewItemInput = styled.input`
    width: 100%;

    text-align: center;

    padding: unset;

    border: none; 
    border-width: 0px; 
    box-shadow: none;

    font-family: "FuturaNowHeadline-Bd";

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
            <div>
                SHOW ALL
            </div>
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
                <div>
                    {board.get("name")}
                </div>
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
                <div>
                    + CREATE NEW BOARD
                </div>
            </Item>
        }
    </Container >
}
