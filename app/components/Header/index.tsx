import firebase from "../../firebase/clientApp"
import { useRef, useState } from "react"
import Link from "next/link"
import styled from "styled-components"

import { useAtom } from "jotai"
import {
    pathAtom,
    showInteractionBarAtom,
    userDocRefAtom
} from "../../store"

import Folders from "../Folders"
import Filter from "../Filter"
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

    const [showFolders, setShowFolders] = useState(false)
    const archiveLinkRef = useRef<HTMLAnchorElement>(null)

    const [showFilter, setShowFilter] = useState(false)
    const filterLinkRef = useRef<HTMLAnchorElement>(null)

    const [showAddCollection, setShowAddCollection] = useState(false)
    const addCollectionRef = useRef<HTMLAnchorElement>(null)


    const [path, setPath] = useAtom(pathAtom)

    const [showInteractionBar, setShowInteractionBar] = useAtom(showInteractionBarAtom)

    return <Container>
        <Navigation>
            {userDocRef &&
                <>
                    <Link href={"/"}>
                        Index
                    </Link >
                    <Link href={"/archive"}>
                        <a>
                            Archive {path}
                        </a>
                    </Link >
                    <Link href={"/archive"}>
                        <a
                            ref={archiveLinkRef}
                            onPointerDown={() => setShowFolders(!showFolders)}>
                            Navigate
                        </a>
                    </Link >
                    <a
                        ref={filterLinkRef}
                        onPointerDown={() => setShowFilter(!showFilter)}>
                        Filter
                    </a >
                    <a
                        ref={addCollectionRef}
                        onPointerDown={() => setShowAddCollection(!showAddCollection)}>
                        + CREATE NEW COLLECTION
                    </a >
                    <FilterMenuToggle
                        onClick={() => setShowInteractionBar(!showInteractionBar)}>
                        ...
                    </FilterMenuToggle>
                </>
            }
            {userDocRef ?
                <Link href={"/login"}>
                    <a onClick={() => {
                        setPath([])
                        firebase.auth().signOut()
                    }}>
                        Logout
                    </a>
                </Link >
                :
                <Link href={"/login"}>
                    <a>
                        Login / Sign Up
                    </a>
                </Link>}
        </Navigation>
        {userDocRef &&
            <>
                {showFolders &&
                    <Folders
                        onHide={event => {
                            if (event.target !== archiveLinkRef.current) {
                                setShowFolders(false)
                            }
                        }} />}
                {showFilter &&
                    <Filter
                        onHide={event => {
                            if (event.target !== filterLinkRef.current) {
                                setShowFilter(false)
                            }
                        }} />}
                {showAddCollection &&
                    <AddCollection
                        onHide={event => {
                            if (event.target !== addCollectionRef.current) {
                                setShowAddCollection(false)
                            }
                        }} />}
            </>
        }
    </Container>
}
