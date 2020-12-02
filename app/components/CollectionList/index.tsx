
import useTasks from "../../hooks/useTasks"
import Task from "./Task"
import { Row } from "./Row"
import { Cell } from "./Cell"
import { useState } from "react"

export default function TaskList() {
    const [orderBy, setOrderBy] = useState("createdAt")
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc")

    const tasks = useTasks(orderBy, orderDirection)

    const setOrder = (newOrderBy: string) => {
        if (orderBy === newOrderBy) {
            setOrderDirection(orderDirection === "desc" ? "asc" : "desc")
        } else {
            setOrderBy(newOrderBy)
            setOrderDirection("desc")
        }
    }

    return <>
        <Row>
            <Cell onClick={() => setOrder("createdAt")}>
                Upload {orderDirection}
            </Cell>
            <Cell
                onClick={() => setOrder("lastUpdatedAt")}>
                Change {orderDirection}
            </Cell>
            <Cell
                onClick={() => setOrder("client")}>
                Client {orderDirection}
            </Cell>
            <Cell
                onClick={() => setOrder("project")}>
                Project {orderDirection}
            </Cell>
            <Cell
                onClick={() => setOrder("name")}>
                Task {orderDirection}
            </Cell>
            <Cell
                onClick={() => setOrder("pinned")}>
                Pin {orderDirection}
            </Cell>
            <Cell></Cell>
        </Row>
        {tasks.map(task => (
            <Task
                key={task.id}
                taskDocSnap={task} />
        ))}
    </>
}
