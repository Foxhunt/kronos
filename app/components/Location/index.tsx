import { useAtom } from "jotai"
import React from "react"
import styled from "styled-components"
import { selectedCollectionDocRefAtom } from "../../store"

import Boards from "./Boards"

const Container = styled.div`
    height: 30px;
    display: grid;
    grid-template-columns: 1fr 100px;
    
    border-bottom: 1px solid black;
`

const UploadArea = styled.div`
    background-color: black;
    color: white;

    display: flex;
    justify-content: center;
    align-items: center;
`

export default function Location() {
    const [selectedCollection] = useAtom(selectedCollectionDocRefAtom)
    return <Container>
        <Boards />
        {selectedCollection && <UploadArea> Upload </UploadArea>}
    </Container >
}
