import firebase from "../../firebase/clientApp"
import { useRef, useState } from "react"
import Link from "next/link"
import styled from "styled-components"

import { useAtom } from "jotai"
import {
    filesToUploadAtom,
    filterFavoriteAtom,
    filterMarkedAtom,
    filterOrderByAtom,
    filterTagsAtom,
    searchFileAtom,
    selectedClientDocRefAtom,
    selectedCollectionDocRefAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
    showFoldersAtom,
    showInteractionBarAtom,
    userDocRefAtom
} from "../../store"

import Folders from "../Folders"
import Filter from "../Filter"

import Circle from "./Circle"
import { useRouter } from "next/router"

const Container = styled.header`
`

const Crumb = styled.div`
    display: inline;
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

const UploadInput = styled.input`
    display: none;
`

export default function Header() {
    const router = useRouter()
    const [userDocRef] = useAtom(userDocRefAtom)

    const [showFolders, setShowFolders] = useAtom(showFoldersAtom)
    const archiveLinkRef = useRef<HTMLAnchorElement>(null)

    const [showFilter, setShowFilter] = useState(false)
    const filterLinkRef = useRef<HTMLAnchorElement>(null)

    const [showInteractionBar, setShowInteractionBar] = useAtom(showInteractionBarAtom)

    const [client, setClient] = useAtom(selectedClientDocRefAtom)
    const [project, setProject] = useAtom(selectedProjectDocRefAtom)
    const [task, setTask] = useAtom(selectedTaskDocRefAtom)
    const [, setBoard] = useAtom(selectedCollectionDocRefAtom)

    const [, setFilesToUpload] = useAtom(filesToUploadAtom)

    const [, setSearchedFile] = useAtom(searchFileAtom)
    const [, setOrderBy] = useAtom(filterOrderByAtom)
    const [, setFavorties] = useAtom(filterFavoriteAtom)
    const [, setMarked] = useAtom(filterMarkedAtom)
    const [, setSelectedTags] = useAtom(filterTagsAtom)

    return <Container>
        <Navigation>
            {userDocRef &&
                <>
                    <div>
                        {router.route === "/" && <Circle />}
                        <Link href={"/"}>
                            Index
                            </Link >
                    </div>
                    <div>
                        {router.route === "/archive" && <Circle />}
                        <Link href={"/archive"}>
                            Archive
                        </Link >
                    </div>
                    <Link href={"/archive"}>
                        <a
                            ref={archiveLinkRef}
                            onPointerDown={() => setShowFolders(!showFolders)}
                            onContextMenu={event => {
                                event.preventDefault()
                                setClient()
                                setProject()
                                setTask()
                                setBoard()
                            }}>
                            {">"} {client && <Crumb
                                onClick={() => {
                                    setClient(client)
                                    setProject(undefined)
                                    setTask(undefined)
                                    setBoard(undefined)
                                }}>
                                {client.get("name")}
                            </Crumb>}
                            {project && <Crumb
                                onClick={() => {
                                    setProject(project)
                                    setTask(undefined)
                                    setBoard(undefined)
                                }}>
                                {" >"} {project.get("name")}
                            </Crumb>}
                            {task && <Crumb
                                onClick={() => {
                                    setTask(task)
                                    setBoard(undefined)
                                }}>
                                {" >"} {task.get("name")}
                            </Crumb>}
                        </a>
                    </Link >
                    <a
                        ref={filterLinkRef}
                        onPointerDown={() => setShowFilter(!showFilter)}
                        onContextMenu={event => {
                            event.preventDefault()
                            setSearchedFile("")
                            setOrderBy({ orderBy: "createdAt", orderDirection: "desc" })
                            setFavorties(false)
                            setMarked(false)
                            setSelectedTags([])
                        }}>
                        Filter
                    </a >
                    <label>
                        Upload Files
                        <UploadInput
                            multiple
                            type={"file"}
                            onChange={event => {
                                if (event.target.files) {
                                    setFilesToUpload(Array.from(event.target.files))
                                }
                                event.target.value = ""
                            }} />
                    </label>
                    <FilterMenuToggle
                        onClick={() => setShowInteractionBar(!showInteractionBar)}>
                        ...
                    </FilterMenuToggle>
                </>
            }
            {userDocRef ?
                <Link href={"/login"}>
                    <a onClick={() => {
                        setClient(undefined)
                        setProject(undefined)
                        setTask(undefined)
                        setBoard(undefined)
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
            </>
        }
    </Container>
}
