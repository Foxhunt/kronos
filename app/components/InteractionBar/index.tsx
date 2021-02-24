import { useEffect, useMemo, useRef, useState } from "react"
import deleteFiles from "../../firebase/deleteFiles"
import downloadFiles from "../../firebase/downloadFiles"
import favoriteFiles from "../../firebase/favoriteFile"
import markFiles from "../../firebase/markFile"
import tagFile from "../../firebase/tagFile"

import styled from "styled-components"

import { useAtom } from "jotai"
import {
    filterFavoriteAtom,
    filterMarkedAtom,
    filterOrderByAtom,
    filterTagsAtom,
    selectedClientDocRefAtom,
    selectedCollectionDocRefAtom,
    selectedFilesAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
    showFilterAtom,
    showFoldersAtom
} from "../../store"
import { useFiles } from "../../hooks"

import TagList from "./TagList"

import IconMarkFineInaktiveSVG from "../../assets/svg/Icons/SQUARE-OUTLINE-FINE.svg"
import IconDeleteSVG from "../../assets/svg/Icons/DELETE.svg"
import IconDownloadSVG from "../../assets/svg/Icons/DOWNLOAD.svg"
import IconSelectedFineInaktiveSVG from "../../assets/svg/Icons/CIRCLE.svg"
import IconAddFineSVG from "../../assets/svg/Icons/PLUS-FINE.svg"

const StyledIconSelectedFineInaktiveSVGBlue = styled(IconSelectedFineInaktiveSVG)`
    fill: #0501ff;
`

const StyledIconSelectedFineInaktiveSVGGreen = styled(IconSelectedFineInaktiveSVG)`
    fill: #33bd27;
`

const Container = styled.ul<{ top: number }>`
    position: sticky;
    top: ${({ top }) => top}px;
    z-index: 2;

    background-color: white;

    height: 30px;
    margin: 0px;
    padding: 0px;

    flex-shrink: 0;

    display: flex;
    justify-content: flex-start;
    align-items: center;
    
    border-bottom: 1px solid black;
`

const Item = styled.li<{ active?: boolean }>`
    list-style-type: none;
    margin-left: 8px;
    margin-right: 20px;

    display: flex;
    align-items: center;

    background-color: ${({ active }) => active ? "#fb2dfb" : ""};
`


const PaddingLeft = styled.div`
    padding-left: 5px;
    padding-bottom: 2px;
`

export default function InteractionBar() {
    const [client] = useAtom(selectedClientDocRefAtom)
    const [project] = useAtom(selectedProjectDocRefAtom)
    const [task] = useAtom(selectedTaskDocRefAtom)
    const [collection] = useAtom(selectedCollectionDocRefAtom)

    const [orderOptions] = useAtom(filterOrderByAtom)
    const [favorite] = useAtom(filterFavoriteAtom)
    const [marked] = useAtom(filterMarkedAtom)
    const [tags] = useAtom(filterTagsAtom)

    const files = useFiles(client, project, task, collection, Infinity, orderOptions, favorite, marked, tags)

    const [selectedFiles, setSelectedFiles] = useAtom(selectedFilesAtom)

    const selectedAll = useMemo(() => {
        return selectedFiles.length > 0 && files.every(file => selectedFiles.some(selectedFile => selectedFile.id === file.id))
    }, [files, selectedFiles])

    // clear selection
    useEffect(() => () => { setSelectedFiles([]) }, [])

    const [showTags, setShowTags] = useState(false)

    const tagToggleRef = useRef<HTMLLIElement>(null)

    const [showFolders] = useAtom(showFoldersAtom)
    const [showFilter] = useAtom(showFilterAtom)

    let top = 30

    if (showFolders || showFilter) {
        top += 186
    }

    return <Container
        top={top}>
        <Item
            active={selectedAll}
            onClick={() => {
                if (selectedAll) {
                    setSelectedFiles([])
                } else {
                    setSelectedFiles(files)
                }
            }}>
            <IconMarkFineInaktiveSVG />
            <PaddingLeft>
                Select All
            </PaddingLeft>
        </Item>
        <Item
            onClick={() => {
                deleteFiles(selectedFiles)
                setSelectedFiles([])
            }}>
            <IconDeleteSVG />
            <PaddingLeft>
                Delete
            </PaddingLeft>
        </Item>
        <Item
            onClick={() => selectedFiles.length > 0 && downloadFiles(selectedFiles)}>
            <IconDownloadSVG />
            <PaddingLeft>
                Download
            </PaddingLeft>
        </Item>
        <Item
            onClick={() => {
                favoriteFiles(selectedFiles)
            }}>
            <StyledIconSelectedFineInaktiveSVGBlue />
            <PaddingLeft>
                Favorite
            </PaddingLeft>
        </Item>
        <Item
            onClick={() => {
                markFiles(selectedFiles)
            }}>
            <StyledIconSelectedFineInaktiveSVGGreen />
            <PaddingLeft>
                Mark
            </PaddingLeft>
        </Item>
        <Item
            ref={tagToggleRef}
            onPointerDown={() => {
                setShowTags(!showTags)
            }}>
            <IconAddFineSVG />
            <PaddingLeft>
                Tag
            </PaddingLeft>
            {showTags &&
                <TagList
                    onHide={() => {
                        setShowTags(false)
                    }}
                    onSelectTag={tag => {
                        for (const file of selectedFiles) {
                            tagFile(file, tag)
                        }
                        setShowTags(false)
                    }} />}
        </Item>
    </Container >
}
