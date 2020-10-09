import Link from "next/link"
import styled from "styled-components"

import { useUser } from "../context/userContext"

const Container = styled.div`
    background-color: black;
    height: 25px;
`

function LoginLogout() {
    const { user, logout } = { ...useUser() }

    return user ?
        <Link href={"/login"}>
            < a onClick={logout} > logout</a >
        </Link >
        :
        <Link href={"/login"}>
            <a>login</a>
        </Link>
}

export default function UserArea() {
    return <Container>
        <LoginLogout />
    </Container>
}

