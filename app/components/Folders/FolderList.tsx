import firebase from "../../firebase/clientApp"
import styled from "styled-components"
import { useRef, useState } from "react"
import { useClickedOutside, useOfflineSearch, useScollIntoView } from "../../hooks"
import { useAtom } from "jotai"
import { filesToUploadAtom, userDocRefAtom } from "../../store"

import IconLeftSVG from "../../assets/svg/Icons/LEFT.svg"
import IconDownSVG from "../../assets/svg/Icons/DOWN.svg"

const StyledIconLeftSVG = styled(IconLeftSVG) <{ fill?: string }>`
    width: 10px;
    height: 10px;

    padding-right: 5px;
    fill: #${({ fill }) => fill ? fill : "000000"};
`

const StyledIconDownSVG = styled(IconDownSVG)`
    padding-right: 5px;
`

import { ItemList, Item } from "../Shared/ItemList"

const FolderCaption = styled(Item) <{ hint?: boolean }>`
    color: ${({ hint }) => hint ? "#000000" : ""};
    background-color: ${({ hint }) => hint ? "#ff0000" : ""};
`

const CreateHint = styled(Item)`
    background-color: #0000ff;
    color: #ffffff;
`

const Container = styled.div`
    min-width: 0px;
`

const ItemForm = styled.form`
    height: 30px;
    border-bottom: black 1px solid;
    padding-left: 8px;
`

const ItemInput = styled.input`
    width: 100%;
    height: 100%;
    padding: unset;

    background-color: inherit;

    border: none;
    box-shadow: none;

    font-family: "FuturaNowHeadline-Bd";
    font-size: inherit;

    &::placeholder {
        color: #dfdfe4;
        line-height: 1;
        text-transform: uppercase;
    }

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
    const [folderName, setFolderName] = useState(userDocRef?.get(name))

    const [newItemName, setNewItemName] = useState("")

    const searchResult = useOfflineSearch({
        searchDocuments: items,
        searchText: newItemName,
        keys: ["name"]
    })

    const [isAdditingLevelName, setIsAdditingLevelName] = useState(false)
    const levelNameInputRef = useRef<HTMLInputElement>(null)
    useClickedOutside(levelNameInputRef, () => {
        userDocRef?.ref.update({ [name]: folderName })
        setIsAdditingLevelName(false)
    })

    const renderItems = []

    if (newItemName !== "") {
        renderItems.push(<CreateHint
            key={"click to create"}
            onClick={() => {
                if (allowAdding) {
                    onAdd(newItemName)
                    setNewItemName("")
                }
            }}>
            {
                allowAdding ?
                    `create ${newItemName}`
                    :
                    <>
                        <StyledIconLeftSVG fill="ffffff" />
                        select {previousName && userDocRef?.get(previousName)}
                    </>
            }
        </CreateHint >)
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
            <div>
                {item.get("name")}
            </div>
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
                <div>
                    {selected.get("name")}
                </div>
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
                        userDocRef?.ref.update({ [name]: folderName })
                    }}>
                    <ItemInput
                        autoFocus
                        ref={levelNameInputRef}
                        type={"text"}
                        value={folderName}
                        onChange={event => {
                            setFolderName(event.target.value)
                        }} />
                </ItemForm>
                :
                <FolderCaption
                    hint={filesToUpload.length > 0 && !selected}
                    onDoubleClick={event => {
                        event.preventDefault()
                        setIsAdditingLevelName(true)
                    }}>
                    {
                        filesToUpload.length > 0 && !selected ?
                            <>
                                {allowAdding ? <StyledIconDownSVG /> : <StyledIconLeftSVG />}
                                Select or Create {userDocRef?.get(name)}
                            </>
                            :
                            userDocRef?.get(name)
                    }
                </FolderCaption>
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
                placeholder={"create/search"}
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
