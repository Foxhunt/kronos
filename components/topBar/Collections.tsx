import firebase from "firebase"
import { useEffect, useState } from "react"
import styled from "styled-components"

const Container = styled.div`
    overflow: auto;
    white-space: nowrap;
    &::-webkit-scrollbar {
        display: none;
    }
`

const Subfolder = styled.div<{ selected?: boolean }>`
    display: inline-block;
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

const NewCollectionForm = styled.form`
    display: inline-block;
    height: 100%;
    width: 150px;

    border-left: black solid 1px;
`

const NewCollectionInput = styled.input`
    padding: unset;
    height: 100%;
    width: 100%;

    border: none;
`

type props = {
    selectedId: string | undefined,
    collection: firebase.firestore.CollectionReference | undefined,
    onSelectCollection: (docRef: firebase.firestore.DocumentReference | undefined) => void
}

export default function Collections({ selectedId, collection, onSelectCollection }: props) {
    const [collections, setCollections] = useState<firebase.firestore.DocumentSnapshot[]>([])
    const [addingCollection, setAddingCollection] = useState(false)
    const [newCollectionName, setNewCollectionName] = useState("")

    useEffect(() => {
        const unsubscribe = collection
            ?.orderBy("createdAt", "asc")
            ?.onSnapshot(snapshot => {
                setCollections(snapshot.docs)

                // const lastAdedFolder = snapshot.docChanges().filter(change => change.type === "added")
                // if (lastAdedFolder.length === 1) {
                //     onSelectSubfolder(lastAdedFolder[0].doc.ref)
                // }
            })

        return () => {
            unsubscribe && unsubscribe()
            onSelectCollection(undefined)
            setNewCollectionName("")
            setCollections([])
        }
    }, [collection])

    return <Container
        onWheel={event => {
            event.currentTarget.scrollBy({ left: event.deltaY * 0.6 })
        }}>
        {
            collections.map(subFolder =>
                <Subfolder
                    key={subFolder.id}
                    selected={selectedId === subFolder.id}
                    onContextMenu={event => {
                        event.preventDefault()
                        subFolder.ref.delete()
                    }}
                    onClick={() => onSelectCollection(subFolder.ref)}>
                    {subFolder.get("name")}
                </Subfolder>)
        }
        {
            addingCollection &&
            <NewCollectionForm
                onSubmit={event => {
                    event.preventDefault()
                    collection?.add({
                        name: newCollectionName,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    setAddingCollection(false)
                    setNewCollectionName("")
                }}>
                <NewCollectionInput
                    type={"text"}
                    autoFocus
                    value={newCollectionName}
                    onBlur={() => setAddingCollection(false)}
                    onChange={event => {
                        setNewCollectionName(event.target.value)
                    }} />
            </NewCollectionForm>
        }
        <Subfolder
            key={"new"}
            onClick={() => setAddingCollection(!addingCollection)}>
            {addingCollection ? "---" : "+++"}
        </Subfolder>
    </Container>
}
