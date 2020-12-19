import React from "react"
import styled from "styled-components"

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
    return <Container>
        <Boards />
        <UploadArea> Upload </UploadArea>
    </Container >
}
