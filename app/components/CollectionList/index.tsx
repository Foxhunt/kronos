
import useTasks from "../../hooks/useTasks"
import Collection from "./Collection"
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
            setOrderDirection(["createdAt", "lastUpdatedAt", "pinned"].includes(newOrderBy) ? "desc" : "asc")
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
                onClick={() => setOrder("clientName")}>
                Client {orderDirection}
            </Cell>
            <Cell
                onClick={() => setOrder("projectName")}>
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
            <Collection
                key={task.id}
                taskDocSnap={task} />
        ))}
    </>
}