import React from "react"
import styled from "styled-components"

import Boards from "./Boards"

const Container = styled.div`
    height: 40px;
`

export default function BoardBar() {
    return <Container>
        <Boards />
    </Container >
}
