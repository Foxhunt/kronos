import firebase from "../../firebase/clientApp"
import Link from "next/link"
import styled from "styled-components"

const Container = styled.nav`
    height: 25px;
    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    
    background-color: black;

    & a {
        text-decoration: none;
        color: white;
    }
`

type props = {
    loggedIn: boolean
}

export default function Navigation({ loggedIn }: props) {
    return <Container>
        {loggedIn ?
            <Link href={"/login"}>
                <a onClick={() => {
                    firebase.auth().signOut()
                }}>
                    logout
                </a>
            </Link >
            :
            <Link href={"/login"}>
                <a>login</a>
            </Link>
        }
    </Container >
}

