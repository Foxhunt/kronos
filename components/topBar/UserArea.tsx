import { User } from "firebase"
import Link from "next/link"
import styled from "styled-components"

const Container = styled.header`
    background-color: black;
    height: 25px;
`

type props = {
    user: User | null | undefined,
    logout: (() => void) | undefined
}

export default function UserArea({ user, logout }: props) {
    return <Container>
        {user ?
            <Link href={"/login"}>
                < a onClick={logout} > logout</a >
            </Link >
            :
            <Link href={"/login"}>
                <a>login</a>
            </Link>}
    </Container>
}

