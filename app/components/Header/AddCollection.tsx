import firebase from "../../firebase/clientApp"
import { useRef, useState } from "react"
import styled from "styled-components"
import { useAtom } from "jotai"
import { userDocRefAtom } from "../../store"

import { useClients, useProjects, useClickedOutside } from "../../hooks"


import FolderList from "../Folders/FolderList"

const Container = styled.div`
    z-index: 1;

    position: absolute;
    top: 0px;

    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;

    background-color: rgb(126 126 126 / 50%);
`

const AddCollectionForm = styled.div`
    width: 50%;
    height: 300px;
    
    display: flex;
    align-items: center;
    justify-content: space-around;

    background-color: rgb(126 126 126);
`

type props = {
    hideAddCollection: () => void
}

export default function AddCollection({ hideAddCollection }: props) {
    const [userDocRef] = useAtom(userDocRefAtom)

    const [collectionName, setCollectionName] = useState("")

    const [client, setClient] = useState<firebase.firestore.DocumentSnapshot | undefined>(undefined)
    const clients = useClients()

    const [project, setProject] = useState<firebase.firestore.DocumentSnapshot | undefined>(undefined)
    const projects = useProjects(client)

    const fromRef = useRef<HTMLDivElement>(null)
    useClickedOutside(fromRef, hideAddCollection)

    return <Container>
        <AddCollectionForm
            ref={fromRef}>
            <label>
                Name
                <input
                    type="text"
                    value={collectionName}
                    onChange={event => setCollectionName(event.target.value)} />
            </label>
            <FolderList
                name={"Clients"}
                selected={client}
                items={clients}
                onSelect={selectedDoc => {
                    if (selectedDoc !== client) {
                        setClient(selectedDoc)
                        setProject(undefined)
                    }
                }}
                allowAdding={Boolean(userDocRef)}
                onAdd={itemName => {
                    userDocRef?.collection("clients").add({
                        name: itemName,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                }} />
            <FolderList
                name={"Projects"}
                selected={project}
                items={projects}
                onSelect={selectedDoc => {
                    if (selectedDoc !== project) {
                        setProject(selectedDoc)
                    }
                }}
                allowAdding={Boolean(client)}
                onAdd={itemName => {
                    userDocRef?.collection("projects").add({
                        name: itemName,
                        client: client?.ref,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                }} />
            <button
                onClick={event => {
                    event.preventDefault()
                    if (collectionName && client && project) {
                        userDocRef?.collection("tasks").add({
                            name: collectionName,
                            pinned: false,
                            client: client?.ref,
                            clientName: client?.get("name"),
                            project: project?.ref,
                            projectName: project?.get("name"),
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        })
                        hideAddCollection()
                    }
                }}>
                add Collection
            </button>
        </AddCollectionForm>
    </Container>

}
