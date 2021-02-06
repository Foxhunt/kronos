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

import Circle from "../Shared/Circle"
import IconLocationSVG from "../../assets/svg/Icons/LOCATION.svg"
import IconVectorSVG from "../../assets/svg/Icons/VECTOR.svg"
import IconSelectedAktiveSVG from "../../assets/svg/Icons/SQUARE.svg"
import IconSelectedInaktiveSVG from "../../assets/svg/Icons/SQUARE-OUTLINE.svg"
import IconUploadSVG from "../../assets/svg/Icons/UPLOAD.svg"
import IconResetSVG from "../../assets/svg/Icons/RESET.svg"

import { useRouter } from "next/router"

import { sortByOptions } from "../Filter"

const Container = styled.header`
`

const PaddingRight = styled.div`
    padding-right: 5px;
    padding-bottom: 2px;
`

const Navigation = styled.nav`
    height: 30px;
    flex-shrink: 0;

    display: grid;
    grid-template-columns: 1fr 1fr 3fr 1fr 1fr 2fr 1fr;
    align-items: stretch;
    
    background-color: black;

    text-transform: uppercase;

    & * {
        text-decoration: none;
        color: white;
    }

    & > * {
        border-right: 2px white solid;

        display: flex;
        align-items: center;

        padding-left: 8px;
    }

    & > *:last-child {
        border-right: none;
    }
`

const Reset = styled.div`
    color: #00cce2;
    display: flex;
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

    const [searchField, setSearchedFile] = useAtom(searchFileAtom)
    const [orderBy, setOrderBy] = useAtom(filterOrderByAtom)
    const [favorites, setFavorties] = useAtom(filterFavoriteAtom)
    const [marked, setMarked] = useAtom(filterMarkedAtom)
    const [selectedTags, setSelectedTags] = useAtom(filterTagsAtom)

    return <Container>
        <Navigation>
            {userDocRef &&
                <>
                    <Link href={"/"}>
                        <div>
                            <Circle
                                fill={router.route === "/" ? "#ffffff" : "#00000000"}
                                stroke="#ffffff" />
                            Index
                        </div>
                    </Link >
                    <Link href={"/archive"}>
                        <div>
                            <Circle
                                fill={router.route === "/archive" ? "#ffffff" : "#00000000"}
                                stroke="#ffffff" />
                            Archive
                        </div>
                    </Link >
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
                            <PaddingRight><IconLocationSVG /></PaddingRight>
                            <PaddingRight>Location</PaddingRight>
                            {client && <PaddingRight><IconVectorSVG />{client.get("name")}</PaddingRight>}
                            {project && <PaddingRight><IconVectorSVG /> {project.get("name")}</PaddingRight>}
                            {task && <PaddingRight><IconVectorSVG /> {task.get("name")}</PaddingRight>}
                        </a>
                    </Link >
                    <a
                        ref={filterLinkRef}
                        onPointerDown={() => setShowFilter(!showFilter)}>
                        <PaddingRight>
                            {showFilter ? <IconSelectedAktiveSVG /> : <IconSelectedInaktiveSVG />}
                        </PaddingRight>
                        <PaddingRight>Filter</PaddingRight>

                        {
                            (searchField !== "" ||
                                orderBy !== sortByOptions[0] ||
                                favorites ||
                                marked ||
                                selectedTags.length > 0) &&

                            <Reset
                                onPointerDown={event => event.stopPropagation()}
                                onClick={() => {
                                    setSearchedFile("")
                                    setOrderBy(sortByOptions[0])
                                    setFavorties(false)
                                    setMarked(false)
                                    setSelectedTags([])
                                }}>
                                <PaddingRight><IconResetSVG /></PaddingRight>
                                <PaddingRight>RESET</PaddingRight>
                            </Reset>
                        }
                    </a >
                    <div
                        onClick={() => setShowInteractionBar(!showInteractionBar)}>
                        <PaddingRight>
                            {showInteractionBar ? <IconSelectedAktiveSVG /> : <IconSelectedInaktiveSVG />}
                        </PaddingRight>
                        <PaddingRight>
                            Options
                        </PaddingRight>
                    </div>
                    <label>
                        <PaddingRight>
                            <IconUploadSVG />
                        </PaddingRight>
                        <PaddingRight>
                            Upload Files
                        </PaddingRight>
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
                </>
            }
            {
                userDocRef &&
                <Link href={"/login"}>
                    <a onClick={() => {
                        setClient(undefined)
                        setProject(undefined)
                        setTask(undefined)
                        setBoard(undefined)
                        firebase.auth().signOut()
                    }}>
                        <PaddingRight>
                            Logout
                        </PaddingRight>
                    </a>
                </Link >
            }
        </Navigation >
        {
            userDocRef &&
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
    </Container >
}
