import Link from "next/link"
import styled from "styled-components"
import { useUser } from "../context/userContext"

const Container = styled.div`
    background-color: grey;
    text-align: center;
    grid-area: timeline;
`

export default function Timeline() {
    const { logout } = { ...useUser() }
    return <Container>
        Timeline
        <Link href={"/login"}>
            <a onClick={logout}>logout</a>
        </Link>
    </Container>
}