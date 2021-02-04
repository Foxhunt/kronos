import { useEffect, useMemo, useRef, useState } from "react"
import deleteFiles from "../../firebase/deleteFiles"
import downloadFiles from "../../firebase/downloadFiles"
import favoriteFile from "../../firebase/favoriteFile"
import markFile from "../../firebase/markFile"
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
    selectedTaskDocRefAtom
} from "../../store"
import { useFiles } from "../../hooks"

import TagList from "./TagList"

import IconDeleteSVG from "../../assets/svg/Icons/ICON_DELETE.svg"
import IconDownloadSVG from "../../assets/svg/Icons/ICON_DOWNLOAD.svg"
import IconSelectedFineInaktiveSVG from "../../assets/svg/Icons/ICON_SELECTED__FINE_INAKTIVE.svg"
import IconAddFineSVG from "../../assets/svg/Icons/ICON_ADD_FINE.svg"
import IconMarkFineInaktiveSVG from "../../assets/svg/Icons/ICON_MARK_FINE_INAKTIVE.svg"



const Container = styled.ul`
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
    position: relative;
    
    list-style-type: none;
    margin: 0px 20px;

    display: flex;
    align-items: center;

    background-color: ${({ active }) => active ? "#fb2dfb" : ""};
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

    return <Container>
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
            Select All
        </Item>
        <Item
            onClick={() => {
                deleteFiles(selectedFiles)
                setSelectedFiles([])
            }}>
            <IconDeleteSVG />
            Delete
        </Item>
        <Item
            onClick={() => selectedFiles.length > 0 && downloadFiles(selectedFiles)}>
            <IconDownloadSVG />
            Download
        </Item>
        <Item
            onClick={() => {
                for (const file of selectedFiles) {
                    markFile(file)
                }
            }}>
            <IconSelectedFineInaktiveSVG />
            Mark
        </Item>
        <Item
            onClick={() => {
                for (const file of selectedFiles) {
                    favoriteFile(file)
                }
            }}>
            <IconSelectedFineInaktiveSVG />
            Favotire
        </Item>
        <Item
            ref={tagToggleRef}
            onPointerDown={(event) => {
                if (event.target === tagToggleRef.current) {
                    setShowTags(!showTags)
                }
            }}>
            <IconAddFineSVG />
            Tag
            {showTags &&
                <TagList
                    onHide={event => {
                        if (event.target !== tagToggleRef.current) {
                            setShowTags(false)
                        }
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
