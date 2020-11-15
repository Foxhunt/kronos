import firebase from "../../firebase/clientApp"
import Link from "next/link"
import styled from "styled-components"
import { useAtom } from "jotai"
import { pathAtom, showTasksAtom, userDocRefAtom } from "../../store"

import LocationAndFolders from "./LocationAndFolders"

import GridSVG from "../../assets/svg/grid.svg"
import ListSVG from "../../assets/svg/list.svg"
import XCircleSVG from "../../assets/svg/x-circle.svg"
import { useRouter } from "next/router"

const StyledGridSVG = styled(GridSVG)`
    color: currentColor;
`

const StyledListSVG = styled(ListSVG)`
    color: currentColor;
`

const StyledXCircleSVG = styled(XCircleSVG)`
    color: currentColor;
`

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
    const router = useRouter()
    const [userDocRef] = useAtom(userDocRefAtom)

    const [, setShowTasks] = useAtom(showTasksAtom)
    const [, setPath] = useAtom(pathAtom)

    return <Container>
        <Navigation>
            <Link href={"/"}>index</Link >
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
        {userDocRef && router.pathname == "/" && <>
            <LocationAndFolders />
            <StyledXCircleSVG onClick={() => setPath([])} />
            <StyledListSVG onClick={() => setShowTasks(true)} />
            <StyledGridSVG onClick={() => setShowTasks(false)} />
        </>}
    </Container>
}
