import firebase from "../../firebase/clientApp"
import { useCallback, useEffect, useRef, useState } from "react"
import { useAtom } from "jotai"
import styled from "styled-components"
import {
    userDocRefAtom,
    selectedClientDocRefAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
    collectionsColRefAtom,
    filesColRefAtom,
} from "../../store"

import useClickedOutside from "../hooks/useClickedOutside"

import List from "./List"
import Collections from "./Collections"

const Container = styled.div`
    position: relative;
    /* z-index: 1; */
    background-color: white;
`

const LocationCollections = styled.div`
    display: grid;
    grid-template-columns: [location] 300px [collections] auto;
    grid-template-rows: 25px;
`

const Path = styled.div<{ inverted: boolean }>`
    background-color: ${({ inverted }) => (inverted ? "black" : "white")};
    color:  ${({ inverted }) => (inverted ? "white" : "black")};
`

const Folders = styled.div`
    display: grid;
    grid-template-columns: [clients] 300px [projects] 300px[tasks] auto;
`

export default function Location() {
    const [userDocRef] = useAtom(userDocRefAtom)

    const [client, setClient] = useAtom(selectedClientDocRefAtom)
    const [clients, setClients] = useState<firebase.firestore.DocumentSnapshot[]>([])
    useEffect(() => {
        userDocRef?.collection("clients").onSnapshot(snapshot => {
            setClients(snapshot.docs)
        })
    }, [userDocRef])

    const [project, setProject] = useAtom(selectedProjectDocRefAtom)
    const [projects, setProjects] = useState<firebase.firestore.DocumentSnapshot[]>([])
    useEffect(() => {
        if (client) {
            userDocRef
                ?.collection("projects")
                .where("client", "==", client)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setProjects(snapshot.docs)
                })
        }
    }, [userDocRef, client])

    const [task, setTask] = useAtom(selectedTaskDocRefAtom)
    const [tasks, setTasks] = useState<firebase.firestore.DocumentSnapshot[]>([])
    useEffect(() => {
        if (project) {
            userDocRef
                ?.collection("tasks")
                .where("client", "==", client)
                .where("project", "==", project)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setTasks(snapshot.docs)
                })
        }
    }, [userDocRef, project])

    const [collections, setCollections] = useAtom(collectionsColRefAtom)
    const [files, setFiles] = useAtom(filesColRefAtom)



    const containerRef = useRef(null)
    const [showFolders, setShowFolders] = useState(false)
    const handleClickedOutside = useCallback(() => {
        setShowFolders(false)
    }, [])

    useClickedOutside(containerRef, handleClickedOutside)

    return <Container
        ref={containerRef}>
        <LocationCollections>
            <Path
                inverted={showFolders}
                onClick={() => setShowFolders(!showFolders)}>
                Location
            </Path>
            <Collections
                selectedId={files?.parent?.id}
                collection={collections}
                onSelectCollection={collection => {
                    if (collection?.collection("files").path !== files?.path) {
                        setFiles(collection?.collection("files"))
                    }
                }}
            />
        </LocationCollections>
        {showFolders && <Folders>
            <List
                name={"Clients"}
                selected={client}
                items={clients}
                onSelect={selectedDoc => {
                    setClient(selectedDoc)
                }}
                onAdd={itemName => {
                    userDocRef?.collection("clients").add({
                        name: itemName,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                }}
            />
            <List
                name={"Projects"}
                selected={project}
                items={projects}
                onSelect={selectedDoc => {
                    setProject(selectedDoc)
                }}
                onAdd={itemName => {
                    userDocRef?.collection("projects").add({
                        name: itemName,
                        client,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                }}
            />
            <List
                name={"Tasks"}
                selected={task}
                items={tasks}
                onSelect={selectedDoc => {
                    setTask(selectedDoc)
                }}
                onAdd={itemName => {
                    userDocRef?.collection("tasks").add({
                        name: itemName,
                        client,
                        project,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                }}
            />
        </Folders>}
    </Container>
}
