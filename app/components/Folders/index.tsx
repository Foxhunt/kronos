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
} from "../../store"

import { useBoards, useClickedOutside, useClients, useProjects, useTasks } from "../../hooks"

import FolderList from "./FolderList"

const Container = styled.div`
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
    const clients = useClients()

    const [project, setProject] = useAtom(selectedProjectDocRefAtom)
    const projects = useProjects(client)

    const [task, setTask] = useAtom(selectedTaskDocRefAtom)
    const tasks = useTasks(client, project, { orderBy: "createdAt", orderDirection: "desc" })

    const [board, setBoard] = useAtom(selectedCollectionDocRefAtom)
    const boards = useBoards(client, project, task)

    const containerRef = useRef<HTMLDivElement>(null)
    useClickedOutside(containerRef, onHide)

    return <Container
        ref={containerRef}>
        <FolderList
            name={userDocRef?.get("level1")}
            selected={client}
            items={clients}
            onSelect={selectedDoc => {
                setClient(selectedDoc)
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
            }} />
        {projects && <FolderList
            name={userDocRef?.get("level2")}
            selected={project}
            items={projects}
            onSelect={async selectedDoc => {
                setClient(await selectedDoc?.get("client").get())
                setProject(selectedDoc)
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
            }} />}
        {tasks && <FolderList
            name={userDocRef?.get("level3")}
            selected={task}
            items={tasks}
            onSelect={async selectedDoc => {
                const [client, project] =
                    await Promise.all<firebase.firestore.DocumentSnapshot>([
                        selectedDoc?.get("client").get(),
                        selectedDoc?.get("project").get()
                    ])
                setClient(client)
                setProject(project)
                setTask(selectedDoc)
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
            }} />}
        {boards && <FolderList
            name={"Boards"}
            selected={board}
            items={boards}
            onSelect={async selectedDoc => {
                const [client, project, task] =
                    await Promise.all<firebase.firestore.DocumentSnapshot>([
                        selectedDoc?.get("client").get(),
                        selectedDoc?.get("project").get(),
                        selectedDoc?.get("task").get()
                    ])
                setClient(client)
                setProject(project)
                setTask(task)
                setBoard(selectedDoc)
            }}
            allowAdding={Boolean(client && project && task)}
            onAdd={async itemName => {
                const newItem = await (await userDocRef?.ref.collection("collections").add({
                    name: itemName,
                    client: client?.ref,
                    project: project?.ref,
                    task: task?.ref,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }))?.get()
                const [newItemClient, newItemProject, newItemTask] =
                    await Promise.all<firebase.firestore.DocumentSnapshot>([
                        newItem?.get("client").get(),
                        newItem?.get("project").get(),
                        newItem?.get("task").get()
                    ])
                setClient(newItemClient)
                setProject(newItemProject)
                setTask(newItemTask)
                setBoard(newItem)
            }} />}
    </Container>
}
