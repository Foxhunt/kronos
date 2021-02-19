import firebase from "../../firebase/clientApp"
import { useRef } from "react";
import { useAtom } from "jotai";
import styled from "styled-components";

import {
    userDocRefAtom,
    selectedClientDocRefAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
    selectedCollectionDocRefAtom,
    clientsAtom,
    projectsAtom,
    tasksAtom,
    boardsAtom,
} from "../../store"

import { useClickedOutside } from "../../hooks"

import FolderList from "./FolderList"

const Container = styled.div`
    background-color: white;
`

const Selectibles = styled.div`
    width: 100%;

    display: grid;
    grid-template-columns: repeat(4,1fr);
    grid-template-rows: calc(6 * 31px - 1px);

    border-bottom: 1px solid black;
`

type props = {
    onHide: (event: MouseEvent) => void
}

export default function Folders({ onHide }: props) {
    const [userDocRef] = useAtom(userDocRefAtom)

    const [client, setClient] = useAtom(selectedClientDocRefAtom)
    const [clients] = useAtom(clientsAtom)

    const [project, setProject] = useAtom(selectedProjectDocRefAtom)
    const [projects] = useAtom(projectsAtom)

    const [task, setTask] = useAtom(selectedTaskDocRefAtom)
    const [tasks] = useAtom(tasksAtom)

    const [board, setBoard] = useAtom(selectedCollectionDocRefAtom)
    const [boards] = useAtom(boardsAtom)

    const containerRef = useRef<HTMLDivElement>(null)
    useClickedOutside(containerRef, onHide)

    return <Container
        ref={containerRef}>
        <Selectibles>
            <FolderList
                name={"level1"}
                selected={client}
                items={clients}
                onSelect={selectedDoc => {
                    if (project || selectedDoc?.id !== client?.id) {
                        setClient(selectedDoc)
                    } else if (!project || selectedDoc?.id === client?.id) {
                        setClient(undefined)
                    }
                    setProject(undefined)
                    setTask(undefined)
                    setBoard(undefined)
                }}
                allowAdding={Boolean(userDocRef)}
                onAdd={async itemName => {
                    const newItem = await (await userDocRef?.ref.collection("clients").add({
                        name: itemName,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }))?.get()
                    setClient(newItem)
                    setProject(undefined)
                    setTask(undefined)
                    setBoard(undefined)
                    firebase.analytics().logEvent("create_client", {
                        name: itemName
                    })
                }} />
            {projects && <FolderList
                name={"level2"}
                previousName={"level1"}
                selected={project}
                items={projects}
                onSelect={async selectedDoc => {
                    !client && setClient(await selectedDoc?.get("client").get())
                    if (task || selectedDoc?.id !== project?.id) {
                        setProject(selectedDoc)
                    } else if (!task || selectedDoc?.id === project?.id) {
                        setProject(undefined)
                    }
                    setTask(undefined)
                    setBoard(undefined)
                }}
                allowAdding={Boolean(client)}
                onAdd={async itemName => {
                    const newItem = await (await userDocRef?.ref.collection("projects").add({
                        name: itemName,
                        client: client?.ref,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }))?.get()
                    setClient(await newItem?.get("client").get())
                    setProject(newItem)
                    setTask(undefined)
                    setBoard(undefined)
                    firebase.analytics().logEvent("create_project", {
                        name: itemName
                    })
                }} />}
            {tasks && <FolderList
                name={"level3"}
                previousName={"level2"}
                selected={task}
                items={tasks}
                onSelect={async selectedDoc => {
                    const [newClient, newProject] =
                        await Promise.all<firebase.firestore.DocumentSnapshot>([
                            selectedDoc?.get("client").get(),
                            selectedDoc?.get("project").get()
                        ])
                    !client && setClient(newClient)
                    !project && setProject(newProject)
                    if (board || selectedDoc?.id !== task?.id) {
                        setTask(selectedDoc)
                    } else if (!board || selectedDoc?.id === task?.id) {
                        setTask(undefined)
                    }
                    setBoard(undefined)
                }}
                allowAdding={Boolean(client && project)}
                onAdd={async itemName => {
                    const newItem = await (await userDocRef?.ref.collection("tasks").add({
                        name: itemName,
                        pinned: false,
                        client: client?.ref,
                        clientName: client?.get("name"),
                        project: project?.ref,
                        projectName: project?.get("name"),
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }))?.get()
                    const [newItemClient, newItemProject] =
                        await Promise.all<firebase.firestore.DocumentSnapshot>([
                            newItem?.get("client").get(),
                            newItem?.get("project").get()
                        ])
                    setClient(newItemClient)
                    setProject(newItemProject)
                    setTask(newItem)
                    setBoard(undefined)
                    firebase.analytics().logEvent("create_task", {
                        name: itemName
                    })
                }} />}
            {/* needs Cleanup! */}
            {boards && <FolderList
                name={"boards"}
                previousName={"level3"}
                selected={board}
                items={boards}
                onSelect={async selectedDoc => {
                    const [newClient, newProject, newTtask] =
                        await Promise.all<firebase.firestore.DocumentSnapshot>([
                            selectedDoc?.get("client").get(),
                            typeof selectedDoc?.get("project") === "string" ? undefined : selectedDoc?.get("project").get(),
                            typeof selectedDoc?.get("task") === "string" ? undefined : selectedDoc?.get("task").get()
                        ])
                    !client && setClient(newClient)
                    !project && setProject(newProject)
                    !task && setTask(newTtask)
                    if (selectedDoc?.id !== board?.id) {
                        setBoard(selectedDoc)
                    } else {
                        setBoard(undefined)
                    }
                }}
                allowAdding={Boolean(client && project && task)}
                onAdd={async itemName => {
                    const newItem = await (await userDocRef?.ref.collection("collections").add({
                        name: itemName,
                        client: client?.ref || "",
                        project: project?.ref || "",
                        task: task?.ref || "",
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }))?.get()
                    const [newItemClient, newItemProject, newItemTask] =
                        await Promise.all<firebase.firestore.DocumentSnapshot>([
                            newItem?.get("client").get(),
                            typeof newItem?.get("project") === "string" ? undefined : newItem?.get("project").get(),
                            typeof newItem?.get("task") === "string" ? undefined : newItem?.get("task").get()
                        ])
                    setClient(newItemClient)
                    setProject(newItemProject)
                    setTask(newItemTask)
                    setBoard(newItem)
                    firebase.analytics().logEvent("create_collection", {
                        name: itemName
                    })
                }} />}
        </Selectibles>
    </Container>
}
