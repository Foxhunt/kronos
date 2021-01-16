import { useAtom } from "jotai"
import { clientsAtom, boardsAtom, projectsAtom, selectedClientDocRefAtom, selectedProjectDocRefAtom, selectedTaskDocRefAtom, tasksAtom } from "../store"

import { useBoards, useClients, useProjects, useTasks } from "../hooks"
import { useEffect } from "react"

export default function FirebaseSubscriptions() {
    const [, setClients] = useAtom(clientsAtom)
    const clients = useClients()
    useEffect(() => {
        setClients(clients)
    }, [clients])
    const [client] = useAtom(selectedClientDocRefAtom)

    const [, setProjects] = useAtom(projectsAtom)
    const projects = useProjects(client)
    useEffect(() => {
        setProjects(projects)
    }, [projects])
    const [project] = useAtom(selectedProjectDocRefAtom)

    const [, setTasks] = useAtom(tasksAtom)
    const tasks = useTasks(client, project, { orderBy: "createdAt", orderDirection: "desc" })
    useEffect(() => {
        setTasks(tasks)
    }, [tasks])
    const [task] = useAtom(selectedTaskDocRefAtom)

    const [, setBoards] = useAtom(boardsAtom)
    const boards = useBoards(client, project, task)
    useEffect(() => {
        setBoards(boards)
    }, [boards])

    return null
}