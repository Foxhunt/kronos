import React, { useState } from "react"
import { useAtom } from "jotai"
import styled from "styled-components"
import {
    pathAtom,
} from "../../store"

import Collections from "./Collections"
import Folders from "./Folders"

const Container = styled.div`
    position: relative;
    background-color: white;
`

const PathAndCollections = styled.div`
    display: grid;
    grid-template-columns: [location] 300px [collections] auto;
    grid-template-rows: 30px;
`

const Path = styled.div<{ inverted: boolean }>`
    display: flex;
    align-items: center;

    padding-left: 25px;

    background-color: ${({ inverted }) => (inverted ? "black" : "white")};
    color:  ${({ inverted }) => (inverted ? "white" : "black")};
`

export default function LocationAndFolders() {
    const [path] = useAtom(pathAtom)

    const [showFolders, setShowFolders] = useState(true)

    return <Container
        onPointerLeave={() => setShowFolders(false)}>
        <PathAndCollections>
            <Path
                inverted={showFolders}
                onPointerEnter={() => setShowFolders(true)}>
                {path}
            </Path>
            <Collections />
        </PathAndCollections>
        {showFolders && <Folders />}
    </Container>
}
