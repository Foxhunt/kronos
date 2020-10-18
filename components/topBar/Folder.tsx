import firebase from "../../firebase/clientApp"
import { useEffect, useState } from "react"
import styled from "styled-components"

const Container = styled.div`
    background-color: white;
`

const Subfolder = styled.div<{ selected?: boolean }>`
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

const NewFolderInput = styled.input`
    padding: unset;
    width: 100%;
    height: 25px;

    border: none;
    border-top: black 1px solid;
`

type props = {
    name: string,
    selectedId: string | undefined,
    collection: firebase.firestore.CollectionReference | undefined,
    onSelectSubfolder: (docRef: firebase.firestore.DocumentReference | undefined) => void
}

export default function Folder({ name, selectedId, collection, onSelectSubfolder }: props) {
    const [subFolders, setSubfolders] = useState<firebase.firestore.DocumentSnapshot[]>([])
    const [addingSubFolder, setAddingSubFolder] = useState(false)
    const [newFolderName, setNewFolderName] = useState("")

    useEffect(() => {
        const unsubscribe = collection
            ?.orderBy("createdAt", "desc")
            ?.onSnapshot(snapshot => {
                setSubfolders(snapshot.docs)
            })

        return () => {
            unsubscribe && unsubscribe()
            setNewFolderName("")
            setSubfolders([])
        }
    }, [collection])

    return <Container>
        <div>{name}</div>
        <Subfolder
            onClick={() => setAddingSubFolder(true)}>
            {addingSubFolder ? "---" : "+++"}
        </Subfolder>
        {
            addingSubFolder &&
            <form
                onSubmit={event => {
                    event.preventDefault()
                    collection?.add({
                        name: newFolderName,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    setAddingSubFolder(false)
                    setNewFolderName("")
                }}>
                <NewFolderInput
                    type={"text"}
                    autoFocus
                    value={newFolderName}
                    onBlur={() => setAddingSubFolder(false)}
                    onChange={event => {
                        setNewFolderName(event.target.value)
                    }} />
            </form>
        }
        {
            subFolders.map(subFolder =>
                <Subfolder
                    key={subFolder.id}
                    selected={selectedId === subFolder.id}
                    onContextMenu={event => {
                        event.preventDefault()
                        subFolder.ref.delete()
                    }}
                    onClick={() => onSelectSubfolder(subFolder.ref)}>
                    {subFolder.get("name")}
                </Subfolder>)
        }
        {
            (new Array((addingSubFolder ? 4 : 5) - subFolders.length)).fill(0).map((_, index) =>
                <Subfolder
                    key={index} />)
        }
    </Container>
}
