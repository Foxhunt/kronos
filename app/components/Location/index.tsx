import React from "react"
import styled from "styled-components"

import { useAtom } from "jotai"
import {
    pathAtom,
    showInteractionBarAtom,
} from "../../store"

import Collections from "./Collections"

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 30px;
`

const Path = styled.div`
    display: flex;
    align-items: center;

    padding-left: 25px;

    background-color: "white";
    color:  "black";
`

const FilterMenuToggle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
`

export default function Location() {
    const [path] = useAtom(pathAtom)
    const [showInteractionBar, setShowInteractionBar] = useAtom(showInteractionBarAtom)

    return <Container>
        <FilterMenuToggle
            onClick={() => setShowInteractionBar(!showInteractionBar)}>
            ...
        </FilterMenuToggle>
        <Path>{path}</Path>
        <Collections />
    </Container >
}
