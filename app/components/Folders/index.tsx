import firebase from "../../firebase/clientApp"
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import styled from "styled-components";

import {
    userDocRefAtom,
    selectedClientDocRefAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
} from "../../store"

import { useClickedOutside, useClients, useProjects } from "../../hooks"

import FolderList from "./FolderList"

const Container = styled.div`
    z-index: 1;

    position: absolute;
    top: 0px;
    
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
`

const FoldersNavigation = styled.div`
    width: 100%;
    max-height: calc(12 * 31px);
    margin-top: 34px;

    display: grid;
    grid-template-columns: repeat(3,1fr);
    grid-template-rows: calc(12 * 31px);
`

type props = {
    onHide: () => void
}

export default function Folders({ onHide }: props) {
    const [userDocRef] = useAtom(userDocRefAtom)

    const [client, setClient] = useAtom(selectedClientDocRefAtom)
    const clients = useClients()

    const [project, setProject] = useAtom(selectedProjectDocRefAtom)
    const projects = useProjects(client)

    const [task, setTask] = useAtom(selectedTaskDocRefAtom)
    const [tasks, setTasks] = useState<firebase.firestore.DocumentSnapshot[]>([])
    useEffect(() => {
        if (userDocRef && client && project) {
            const unsubscribe = userDocRef
                .collection("tasks")
                .where("client", "==", client.ref)
                .where("project", "==", project.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setTasks(snapshot.docs)
                })
            return () => {
                unsubscribe()
                setTasks([])
            }
        }
    }, [userDocRef, client, project])

    const foldersNavigationRef = useRef<HTMLDivElement>(null)
    useClickedOutside(foldersNavigationRef, onHide)

    return <Container>
        <FoldersNavigation
            ref={foldersNavigationRef}>
            <FolderList
                name={"Clients"}
                selected={client}
                items={clients}
                onSelect={selectedDoc => {
                    setClient(selectedDoc)
                    setProject(undefined)
                    setTask(undefined)
                }}
                allowAdding={Boolean(userDocRef)}
                onAdd={itemName => {
                    userDocRef?.collection("clients").add({
                        name: itemName,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                }} />
            {projects && <FolderList
                name={"Projects"}
                selected={project}
                items={projects}
                onSelect={selectedDoc => {
                    setProject(selectedDoc)
                    setTask(undefined)
                }}
                allowAdding={Boolean(client)}
                onAdd={itemName => {
                    userDocRef?.collection("projects").add({
                        name: itemName,
                        client: client?.ref,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                }} />}
            {tasks && <FolderList
                name={"Tasks"}
                selected={task}
                items={tasks}
                onSelect={selectedDoc => {
                    setTask(selectedDoc)
                }}
                allowAdding={Boolean(client && project)}
                onAdd={itemName => {
                    userDocRef?.collection("tasks").add({
                        name: itemName,
                        pinned: false,
                        client: client?.ref,
                        clientName: client?.get("name"),
                        project: project?.ref,
                        projectName: project?.get("name"),
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                }} />}
        </FoldersNavigation>
    </Container>
}
