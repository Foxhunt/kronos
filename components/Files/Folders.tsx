import firebase from "../../firebase/clientApp"
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import styled from "styled-components";

import {
    userDocRefAtom,
    selectedClientDocRefAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
    selectedCollectionDocRefAtom,
} from "../../store"

import List from "./List"

const Container = styled.div`
    display: grid;
    grid-template-columns: [clients] 300px [projects] 300px[tasks] auto;
`

export default function Folders() {
    const [userDocRef] = useAtom(userDocRefAtom)

    const [, setCollection] = useAtom(selectedCollectionDocRefAtom)

    const [client, setClient] = useAtom(selectedClientDocRefAtom)
    const [clients, setClients] = useState<firebase.firestore.DocumentSnapshot[]>([])
    useEffect(() => {
        const unsubscribe = userDocRef
            ?.collection("clients")
            .onSnapshot(snapshot => {
                setClients(snapshot.docs)
            })
        return () => {
            unsubscribe && unsubscribe()
            setClients([])
        }
    }, [userDocRef])

    const [project, setProject] = useAtom(selectedProjectDocRefAtom)
    const [projects, setProjects] = useState<firebase.firestore.DocumentSnapshot[]>([])
    useEffect(() => {
        if (userDocRef && client) {
            const unsubscribe = userDocRef
                .collection("projects")
                .where("client", "==", client.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setProjects(snapshot.docs)
                })
            return () => {
                unsubscribe()
                setProjects([])
            }
        }
    }, [userDocRef, client])

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

    return <Container>
        <List
            name={"Clients"}
            selected={client}
            items={clients}
            onSelect={selectedDoc => {
                if (selectedDoc !== client) {
                    setClient(selectedDoc)
                }
                setProject(undefined)
                setTask(undefined)
                setCollection(undefined)
            }}
            allowAdding={Boolean(userDocRef)}
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
                if (selectedDoc !== project) {
                    setProject(selectedDoc)
                }
                setTask(undefined)
                setCollection(undefined)
            }}
            allowAdding={Boolean(client)}
            onAdd={itemName => {
                userDocRef?.collection("projects").add({
                    name: itemName,
                    client: client?.ref,
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
                if (selectedDoc !== task) {
                    setTask(selectedDoc)
                }
                setCollection(undefined)
            }}
            allowAdding={Boolean(client && project)}
            onAdd={itemName => {
                userDocRef?.collection("tasks").add({
                    name: itemName,
                    client: client?.ref,
                    project: project?.ref,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                })
            }}
        />
    </Container>
}
