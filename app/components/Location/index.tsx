import React from "react"
import { useAtom } from "jotai"
import styled from "styled-components"
import {
    pathAtom,
} from "../../store"

import Collections from "./Collections"

const Container = styled.div`
    display: grid;
    grid-template-columns: [location] 300px [collections] auto;
    grid-template-rows: 30px;
`

const Path = styled.div`
    display: flex;
    align-items: center;

    padding-left: 25px;

    background-color: "white";
    color:  "black";
`

export default function Location() {
    const [path] = useAtom(pathAtom)

    return <Container>
        <Path>{path}</Path>
        <Collections />
    </Container >
}
