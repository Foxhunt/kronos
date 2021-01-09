import firebase from "../../firebase/clientApp"
import { useRef, useState } from "react"
import styled from "styled-components"
import { useAtom } from "jotai"
import { selectedClientDocRefAtom, selectedProjectDocRefAtom, userDocRefAtom } from "../../store"

import { useClients, useProjects, useClickedOutside } from "../../hooks"


import FolderList from "../Folders/FolderList"

const Container = styled.div`
    width: 100%;

    display: grid;
    grid-template-columns: repeat(4,1fr);
    grid-template-rows: calc(6 * 31px);

    border-bottom: 1px solid black;
`

type props = {
    onHide: (event: MouseEvent) => void
}

export default function AddCollection({ onHide }: props) {
    const [userDocRef] = useAtom(userDocRefAtom)

    const [collectionName, setCollectionName] = useState("")

    const [archiveSelectedClient] = useAtom(selectedClientDocRefAtom)
    const [client, setClient] = useState<firebase.firestore.DocumentSnapshot | undefined>(archiveSelectedClient)
    const clients = useClients()

    const [archiveSelectedProject] = useAtom(selectedProjectDocRefAtom)
    const [project, setProject] = useState<firebase.firestore.DocumentSnapshot | undefined>(archiveSelectedProject)
    const projects = useProjects(client)

    const containerRef = useRef<HTMLDivElement>(null)
    useClickedOutside(containerRef, onHide)

    return <Container
        ref={containerRef}>
        <FolderList
            name={userDocRef?.get("level1")}
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
                userDocRef?.ref.collection("clients").add({
                    name: itemName,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                })
            }} />
        <FolderList
            name={userDocRef?.get("level2")}
            selected={project}
            items={projects}
            onSelect={selectedDoc => {
                if (selectedDoc !== project) {
                    setProject(selectedDoc)
                }
            }}
            allowAdding={Boolean(client)}
            onAdd={itemName => {
                userDocRef?.ref.collection("projects").add({
                    name: itemName,
                    client: client?.ref,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                })
            }} />
        <label>
            Name
                <input
                type="text"
                value={collectionName}
                onChange={event => setCollectionName(event.target.value)} />
        </label>
        <button
            onClick={event => {
                event.preventDefault()
                if (collectionName && client && project) {
                    userDocRef?.ref.collection("tasks").add({
                        name: collectionName,
                        pinned: false,
                        client: client?.ref,
                        clientName: client?.get("name"),
                        project: project?.ref,
                        projectName: project?.get("name"),
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    onHide(event.nativeEvent)
                }
            }}>
            add Collection
            </button>
    </Container>

}
