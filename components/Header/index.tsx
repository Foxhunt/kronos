import firebase from "../../firebase/clientApp"
import Link from "next/link"
import styled from "styled-components"
import { useAtom } from "jotai"
import { userDocRefAtom } from "../../store"

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

    return <header>
        <Navigation>
            <Link href={"/"}><a>home</a></Link >
            <Link href={"/files"}><a>files</a></Link >
            <Link href={"/favorites"}><a>favorites</a></Link >
            <Link href={"/info"}><a>info</a></Link >
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
    </header>
}
