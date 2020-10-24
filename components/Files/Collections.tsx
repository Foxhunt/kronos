import firebase from "../../firebase/clientApp"
import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import styled from "styled-components"
import {
    selectedClientDocRefAtom,
    selectedCollectionDocRefAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
    userDocRefAtom
} from "../../store"

const Container = styled.div`
    overflow: auto;
    white-space: nowrap;
    &::-webkit-scrollbar {
        display: none;
    }
`

const Item = styled.div<{ selected?: boolean }>`
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

const NewItemForm = styled.form`
    display: inline-block;
    height: 100%;
    width: 150px;

    border-left: black solid 1px;
`

const NewItemInput = styled.input`
    padding: unset;
    height: 100%;
    width: 100%;

    border: none;
`

export default function Collections() {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [client] = useAtom(selectedClientDocRefAtom)
    const [project] = useAtom(selectedProjectDocRefAtom)
    const [task] = useAtom(selectedTaskDocRefAtom)

    const [selectedCollection, setCollection] = useAtom(selectedCollectionDocRefAtom)
    const [collections, setCollections] = useState<firebase.firestore.DocumentSnapshot[]>([])
    useEffect(() => {
        if (userDocRef && client && project && task) {
            const unsubscribe = userDocRef
                .collection("collections")
                .where("client", "==", client.ref)
                .where("project", "==", project.ref)
                .where("task", "==", task.ref)
                .orderBy("createdAt", "asc")
                .onSnapshot(snapshot => {
                    setCollections(snapshot.docs)
                })

            return () => {
                unsubscribe()
                setCollections([])
            }
        }
    }, [userDocRef, client, project, task])

    const [addingItem, setAddingItem] = useState(false)
    const [newItemName, setNewItemName] = useState("")

    return <Container
        onWheel={event => {
            event.currentTarget.scrollBy({ left: event.deltaY * 0.6 })
        }}>
        {
            collections?.map(collection =>
                <Item
                    key={collection.id}
                    selected={selectedCollection?.id === collection.id}
                    onContextMenu={event => {
                        event.preventDefault()
                        collection.ref.delete()
                    }}
                    onClick={() => {
                        if (collection === selectedCollection) {
                            setCollection(undefined)
                        } else {
                            setCollection(collection)
                        }
                    }}>
                    {collection.get("name")}
                </Item>)
        }
        {
            addingItem &&
            <NewItemForm
                onSubmit={event => {
                    event.preventDefault()
                    userDocRef?.collection("collections").add({
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
        {
            client &&
            project &&
            task &&
            <Item
                onClick={() => setAddingItem(!addingItem)}>
                {addingItem ? "---" : "+++"}
            </Item>
        }
    </Container >
}
