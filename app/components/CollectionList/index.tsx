import firebase from "../../firebase/clientApp"
import styled from "styled-components"
import { useCollection } from "react-firebase-hooks/firestore"

import Collection from "./Collection"
import { useState } from "react"

import { useAtom } from "jotai"
import { filesToUploadAtom, userDocRefAtom } from "../../store"
import { DropzoneRootProps } from "react-dropzone"
import { useTasks } from "../../hooks"

import IconUpSVG from "../../assets/svg/Icons/UP.svg"
import IconDownSVG from "../../assets/svg/Icons/DOWN.svg"

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    
    outline: none;
`

const StyledIconUpSVG = styled(IconUpSVG)`
    padding-left: 5px;
`

const StyledIconDownSVG = styled(IconDownSVG)`
    padding-left: 5px;
`

const Hint = styled.label`
    width: 100%;
    height: calc(100vh - 61px);
    display: flex;
    align-items: center;
    justify-content: center;
`

const Overflow = styled.div`
    max-height: calc(100vh - 41px - 60px);
    overflow-y: auto;
`

const UploadInput = styled.input`
    display: none;
`

export const Row = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr) 6fr repeat(2, 1fr);
    grid-template-rows: 30px;

    border-bottom: 1px solid black;
`

const CreateCollection = styled.div`
    height: 30px;

    border-bottom: 1px solid black;
`

export const Cell = styled.div`
    min-width: 0px;

    display: flex;
    justify-content: left;
    align-items: center;

    padding-left: 8px;

    & > div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: initial;
    }
`

type props = {
    getRootProps?: (props?: DropzoneRootProps) => DropzoneRootProps
}

export default function CollectionList({ getRootProps }: props) {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [orderBy, setOrderBy] = useState("createdAt")
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc")

    const [collections, loading, error] = useCollection<Collection>(
        userDocRef?.ref.collection("collections").orderBy(orderBy, orderDirection)
    )

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
        <CreateCollection
            onClick={() => {
                userDocRef?.ref.collection("collections").add({
                    name: "new Collection!",
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    pinned: false
                } as Collection)
            }}>
            Create Collection +
        </CreateCollection>
        <Row>
            <Cell onClick={() => setOrder("createdAt")}>
                UPLOADED {orderBy === "createdAt" && <> {orderDirection === "desc" ? <StyledIconDownSVG /> : <StyledIconUpSVG />} </>}
            </Cell>
            <Cell
                onClick={() => setOrder("lastUpdatedAt")}>
                CHANGED {orderBy === "lastUpdatedAt" && <> {orderDirection === "desc" ? <StyledIconDownSVG /> : <StyledIconUpSVG />} </>}
            </Cell>
            <Cell
                onClick={() => setOrder("clientName")}>
                {userDocRef?.get("level1")}
                {orderBy === "clientName" && <>{orderDirection === "desc" ? <StyledIconDownSVG /> : <StyledIconUpSVG />}</>}
            </Cell>
            <Cell
                onClick={() => setOrder("pinned")}>
                PIN {orderBy === "pinned" && <>{orderDirection === "desc" ? <StyledIconDownSVG /> : <StyledIconUpSVG />}</>}
            </Cell>
            <Cell></Cell>
        </Row>
        {loading && <div>loading ...</div>}
        {collections?.docs.length ?
            <Overflow>
                {collections.docs.map(collection => (
                    <Collection
                        key={collection.id}
                        taskDocSnap={collection} />
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
