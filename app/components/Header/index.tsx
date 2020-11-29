import firebase from "../../firebase/clientApp"
import Link from "next/link"
import styled from "styled-components"
import { useAtom } from "jotai"
import { userDocRefAtom } from "../../store"

const Container = styled.header`
    position: sticky;
    top: 0px;
    z-index: 2;
    background-color: white;
`

const Navigation = styled.nav`
    height: 30px;
    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: space-around;
    
    background-color: black;

    & a {
        text-decoration: none;
        color: white;
    }
`

export default function Header() {
    const [userDocRef] = useAtom(userDocRefAtom)

    return <Container>
        <Navigation>
            <Link href={"/"}>Index</Link >
            <Link href={"/archive"}>Archive</Link >
            <Link href={"/catalogue"}>Catalogue</Link >
            <Link href={"/tags"}>tags</Link >
            <Link href={"/info"}>info</Link >
            {userDocRef ?
                <Link href={"/login"}>
                    <a onClick={() => { firebase.auth().signOut() }}> logout</a>
                </Link >
                :
                <Link href={"/login"}>
                    <a>login</a>
                </Link>
            }
        </Navigation>
    </Container>
}
