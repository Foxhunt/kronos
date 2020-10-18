import firebase from "../../firebase/clientApp"
import Link from "next/link"
import styled from "styled-components"

const Container = styled.header`
    background-color: black;
    height: 25px;
`

type props = {
    loggedIn: boolean
}

export default function UserArea({ loggedIn }: props) {
    return <Container>
        {loggedIn ?
            <Link href={"/login"}>
                < a onClick={() => firebase.auth().signOut()} > logout</a >
            </Link >
            :
            <Link href={"/login"}>
                <a>login</a>
            </Link>}
    </Container>
}

