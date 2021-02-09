import firebase from "../../firebase/clientApp"
import { useRef, useState } from "react"
import { useAtom } from "jotai"
import styled from "styled-components"
import {
    selectedClientDocRefAtom,
    selectedCollectionDocRefAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
    showFilterAtom,
    showFoldersAtom,
    showInteractionBarAtom,
    userDocRefAtom
} from "../../store"

import PlusSVG from "../../assets/svg/Icons/PLUS.svg"

import { useBoards, useScollIntoView } from "../../hooks"
import { sortByOptions } from "../Filter"

const Container = styled.div<{ top: number }>`
    position: sticky;
    top: ${({ top }) => top}px;
    z-index: 1;

    height: 48px;
    flex-shrink: 0;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;

    align-items: center;
    
    gap: 8px;
    padding: 0px 7px;
    
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
    height: 26px;

    padding: 0px 5px;
    border: black solid 1px;
    border-radius: 20px;

    background-color: white;

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

const ItemText = styled.div`
    padding-bottom: 2px;
    
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
    const boards = useBoards(client, project, task, sortByOptions[1])

    const [addingItem, setAddingItem] = useState(false)
    const [newItemName, setNewItemName] = useState("")

    const [showFolders] = useAtom(showFoldersAtom)
    const [showFilter] = useAtom(showFilterAtom)
    const [showInteractionBar] = useAtom(showInteractionBarAtom)

    let top = 30

    if (showFolders || showFilter) {
        top += 186
    }

    if (showInteractionBar) {
        top += 31
    }

    const selectedItemRef = useRef<HTMLDivElement>(null)
    useScollIntoView(selectedItemRef)

    return <Container
        top={top}
        onWheel={event => {
            event.currentTarget.scrollBy({ left: event.deltaY * 0.6 })
        }}>
        <Item
            selected={!selectedBoard}
            onPointerDown={() => {
                setBoard(undefined)
            }}>
            <ItemText>
                SHOW ALL
            </ItemText>
        </Item>
        {boards?.map(board =>
            <Item
                ref={selectedBoard?.id === board.id ? selectedItemRef : undefined}
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
                <ItemText>
                    {board.get("name")}
                </ItemText>
            </Item>)
        }
        {addingItem &&
            <NewItemForm
                onSubmit={async event => {
                    event.preventDefault()
                    const newItem = await (await userDocRef?.ref.collection("collections").add({
                        name: newItemName,
                        client: client?.ref || "",
                        project: project?.ref || "",
                        task: task?.ref || "",
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }))?.get()

                    setBoard(newItem)
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
                <ItemText>
                    <PlusSVG /> CREATE NEW BOARD
                </ItemText>
            </Item>
        }
    </Container >
}
