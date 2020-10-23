import React, { useCallback, useRef, useState } from "react"
import { useAtom } from "jotai"
import styled from "styled-components"

import { pathAtom, userDocRefAtom } from "../../store"

import useClickedOutside from "../hooks/useClickedOutside"

import Navigation from "./Navigation"
import Collections from "./Collections"
import Folders from "./Folders"

const LocationAndFolders = styled.div`
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

export default function Header() {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [path] = useAtom(pathAtom)

    const containerRef = useRef(null)
    const [showFolders, setShowFolders] = useState(false)
    const handleClickedOutside = useCallback(async () => {
        setShowFolders(false)
    }, [])

    useClickedOutside(containerRef, handleClickedOutside)

    return <header>
        <Navigation
            loggedIn={userDocRef !== undefined} />
        {
            userDocRef &&
            <LocationAndFolders
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
            </LocationAndFolders>
        }
    </header>
}
