import styled from "styled-components"

import { useTasks } from "../../hooks"
import Collection from "./Collection"
import { useState } from "react"
import { useAtom } from "jotai"
import { showAddCollectionAtom } from "../../store"

const Container = styled.div`
`

const Hint = styled.div`
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
`

export const Row = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: 40px;

    border-bottom: 1px solid black;
`

export const Cell = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
`

export default function CollectionList() {
    const [orderBy, setOrderBy] = useState("createdAt")
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc")

    const tasks = useTasks(undefined, undefined, { orderBy, orderDirection })

    const setOrder = (newOrderBy: string) => {
        if (orderBy === newOrderBy) {
            setOrderDirection(orderDirection === "desc" ? "asc" : "desc")
        } else {
            setOrderBy(newOrderBy)
            setOrderDirection(["createdAt", "lastUpdatedAt", "pinned"].includes(newOrderBy) ? "desc" : "asc")
        }
    }

    const [, setShowAddCollection] = useAtom(showAddCollectionAtom)

    return <Container>
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
        {tasks.length ?
            tasks.map(task => (
                <Collection
                    key={task.id}
                    taskDocSnap={task} />
            ))
            :
            <Hint
                onClick={() => setShowAddCollection(true)}>
                No Collections in your Archive yet. create one!
            </Hint>
        }
    </Container>
}
