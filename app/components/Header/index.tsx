import firebase from "../../firebase/clientApp"
import { useRef, useState } from "react"
import Link from "next/link"
import styled from "styled-components"

import { useAtom } from "jotai"
import { pathAtom, selectedClientDocRefAtom, selectedProjectDocRefAtom, showInteractionBarAtom, userDocRefAtom } from "../../store"

import Folders from "../Folders"
import AddCollection from "./AddCollection"
import { useClients, useProjects, useTasks } from "../../hooks"

const Container = styled.header`
`

const Navigation = styled.nav`
    height: 30px;
    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: space-around;
    
    background-color: white;

    border-bottom: 1px solid black;

    & a {
        text-decoration: none;
        color: black;
    }
`

const FilterMenuToggle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
`

export default function Header() {
    const [userDocRef] = useAtom(userDocRefAtom)

    const [client] = useAtom(selectedClientDocRefAtom)
    const clients = useClients()

    const [project] = useAtom(selectedProjectDocRefAtom)
    const projects = useProjects(client)

    const tasks = useTasks(client, project, { orderBy: "createdAt", orderDirection: "desc" })

    const [showFolders, setShowFolders] = useState(false)
    const [showAddCollection, setShowAddCollection] = useState(false)

    const archiveLinkRef = useRef<HTMLAnchorElement>(null)

    const [path, setPath] = useAtom(pathAtom)

    const [showInteractionBar, setShowInteractionBar] = useAtom(showInteractionBarAtom)

    return <Container>
        <Navigation>
            <Link href={"/"}>
                Index
            </Link >
            <Link href={"/archive"}>
                <a
                    ref={archiveLinkRef}
                    onPointerDown={() => userDocRef && setShowFolders(!showFolders)}>
                    Archive {path}
                </a>
            </Link >
            <div>
                Filter
            </div >
            {userDocRef && <a onClick={() => setShowAddCollection(!showAddCollection)}>
                + CREATE NEW COLLECTION
            </a >}
            {userDocRef && <FilterMenuToggle
                onClick={() => setShowInteractionBar(!showInteractionBar)}>
                ...
            </FilterMenuToggle>}
            {userDocRef ?
                <Link href={"/login"}>
                    <a onClick={() => {
                        setPath([])
                        firebase.auth().signOut()
                    }}>
                        logout
                    </a>
                </Link >
                :
                <Link href={"/login"}>
                    <a>
                        login
                    </a>
                </Link>}
        </Navigation>
        {userDocRef && showFolders &&
            <Folders
                clients={clients}
                projects={projects}
                tasks={tasks}
                onHide={event => {
                    if (event.target !== archiveLinkRef.current) {
                        setShowFolders(false)
                    }
                }} />}
        {userDocRef && showAddCollection &&
            <AddCollection
                onHide={() => setShowAddCollection(false)} />}
    </Container>
}
