import React, { useCallback, useRef, useState } from "react"
import { useAtom } from "jotai"
import styled from "styled-components"
import {
    selectedCollectionDocRefAtom,
    selectedClientDocRefAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
    pathAtom,
} from "../../store"

import useClickedOutside from "../hooks/useClickedOutside"

import Collections from "./Collections"
import Folders from "./Folders"

const Container = styled.div`
    position: relative;
    background-color: white;
`

const PathAndCollections = styled.div`
    display: grid;
    grid-template-columns: [location] 300px [collections] auto;
    grid-template-rows: 25px;
`

const Path = styled.div<{ inverted: boolean }>`
    background-color: ${({ inverted }) => (inverted ? "black" : "white")};
    color:  ${({ inverted }) => (inverted ? "white" : "black")};
`

export default function LocationAndFolders() {
    const [, setClient] = useAtom(selectedClientDocRefAtom)
    const [, setProject] = useAtom(selectedProjectDocRefAtom)
    const [, setTask] = useAtom(selectedTaskDocRefAtom)
    const [collection] = useAtom(selectedCollectionDocRefAtom)

    const [path] = useAtom(pathAtom)

    const containerRef = useRef(null)
    const [showFolders, setShowFolders] = useState(false)
    const handleClickedOutside = useCallback(async () => {
        setShowFolders(false)
        if (collection) {
            setClient(await collection?.get("client").get({ source: "cache" }))
            setProject(await collection?.get("project").get({ source: "cache" }))
            setTask(await collection?.get("task").get({ source: "cache" }))
        }
    }, [collection])

    useClickedOutside(containerRef, handleClickedOutside)

    return <Container
        ref={containerRef}>
        <PathAndCollections>
            <Path
                inverted={showFolders}
                onClick={() => setShowFolders(!showFolders)}>
                {path}
            </Path>
            <Collections />
        </PathAndCollections>
        {showFolders && <Folders />}
    </Container>
}
