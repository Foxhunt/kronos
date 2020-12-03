import firebase from "../../firebase/clientApp"
import Link from "next/link"
import styled from "styled-components"
import { useAtom } from "jotai"
import { userDocRefAtom } from "../../store"
import { useState } from "react"
import AddCollection from "./AddCollection"

const Container = styled.header`
`

const Navigation = styled.nav`
    height: 30px;
    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: space-around;
    
    background-color: white;

    border-bottom: 4px solid black;

    & a {
        text-decoration: none;
        color: black;
    }
`

export default function Header() {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [showAddCollection, setShowAddCollection] = useState(false)

    return <Container>
        <Navigation>
            <Link href={"/"}>Index</Link >
            <Link href={"/archive"}>Archive</Link >
            <Link href={"/catalogue"}>Catalogue</Link >
            <div
                onClick={() => setShowAddCollection(!showAddCollection)}>
                + CREATE NEW COLLECTION
            </div >
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
        {
            showAddCollection &&
            <AddCollection
                hideAddCollection={() => setShowAddCollection(false)} />
        }
    </Container>
}
