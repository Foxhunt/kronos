import styled from "styled-components"

import Collection from "./Collection"
import { useState } from "react"

import { useAtom } from "jotai"
import { filesToUploadAtom } from "../../store"
import { DropzoneRootProps } from "react-dropzone"
import { useTasks } from "../../hooks"

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    
    outline: none;
`

const Hint = styled.label`
    flex: 1;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Overflow = styled.div`
    max-height: calc(100vh - 41px - 30px);
    overflow-y: auto;
`

const UploadInput = styled.input`
    display: none;
`

export const Row = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr) repeat(3, 2fr) repeat(2, 1fr);
    grid-template-rows: 40px;

    border-bottom: 1px solid black;
`

export const Cell = styled.div`
    min-width: 0px;

    display: flex;
    justify-content: left;
    align-items: center;

    padding-left: 5px;

    & > div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
`

type props = {
    getRootProps?: (props?: DropzoneRootProps) => DropzoneRootProps
}

export default function CollectionList({ getRootProps }: props) {
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

    const [, setFilesToUpload] = useAtom(filesToUploadAtom)

    return <Container
        {...(getRootProps ? getRootProps({}) : {})}>
        <Row>
            <Cell onClick={() => setOrder("createdAt")}>
                <div>
                    Upload {orderDirection}
                </div>
            </Cell>
            <Cell
                onClick={() => setOrder("lastUpdatedAt")}>
                <div>
                    Change {orderDirection}
                </div>
            </Cell>
            <Cell
                onClick={() => setOrder("clientName")}>
                <div>
                    Client {orderDirection}
                </div>
            </Cell>
            <Cell
                onClick={() => setOrder("projectName")}>
                <div>
                    Project {orderDirection}
                </div>
            </Cell>
            <Cell
                onClick={() => setOrder("name")}>
                <div>
                    Task {orderDirection}
                </div>
            </Cell>
            <Cell
                onClick={() => setOrder("pinned")}>
                <div>
                    Pin {orderDirection}
                </div>
            </Cell>
            <Cell></Cell>
        </Row>
        {tasks.length ?
            <Overflow>
                {tasks.map(task => (
                    <Collection
                        key={task.id}
                        taskDocSnap={task} />
                ))}
            </Overflow>
            :
            <Hint>
                Click to upload files
                <UploadInput
                    multiple
                    onChange={event => {
                        if (event.target.files) {
                            setFilesToUpload(Array.from(event.target.files))
                        }
                        event.target.value = ""
                    }}
                    type={"file"} />
            </Hint>
        }
    </Container>
}
