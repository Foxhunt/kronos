import firebase from "../../firebase/clientApp"
import { useRef } from "react";
import { useAtom } from "jotai";
import styled from "styled-components";

import {
    userDocRefAtom,
    selectedClientDocRefAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
} from "../../store"

import { useClickedOutside, useClients, useProjects, useTasks } from "../../hooks"

import FolderList from "./FolderList"

const Container = styled.div`
    width: 100%;
    max-height: calc(6 * 31px);

    display: grid;
    grid-template-columns: repeat(3,1fr);
    grid-template-rows: calc(6 * 31px);
`

type props = {
    onHide: (event: MouseEvent) => void
}

export default function Folders({ onHide }: props) {
    const [userDocRef] = useAtom(userDocRefAtom)

    const [client, setClient] = useAtom(selectedClientDocRefAtom)
    const clients = useClients()

    const [project, setProject] = useAtom(selectedProjectDocRefAtom)
    const projects = useProjects(client)

    const [task, setTask] = useAtom(selectedTaskDocRefAtom)
    const tasks = useTasks(client, project, { orderBy: "createdAt", orderDirection: "desc" })

    const containerRef = useRef<HTMLDivElement>(null)
    useClickedOutside(containerRef, onHide)

    return <Container
        ref={containerRef}>
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
    </Container>
}
