import { useEffect, useMemo, useState } from "react"
import deleteFile from "../../firebase/deleteFile"
import downloadFiles from "../../firebase/downloadFiles"
import favoriteFile from "../../firebase/favoriteFile"
import markFile from "../../firebase/markFile"
import tagFile from "../../firebase/tagFile"

import styled from "styled-components"

import { useAtom } from "jotai"
import { selectedFilesAtom } from "../../store"
import { useFiles } from "../../hooks"

import TagList from "./TagList"

const Container = styled.ul`
    height: 30px;
    margin: 0px;
    padding: 0px;

    display: flex;
    justify-content: flex-start;
    align-items: center;
`

const Item = styled.li<{ active?: boolean }>`
    list-style-type: none;
    margin: 0px 20px;

    background-color: ${({ active }) => active ? "#fb2dfb" : ""};
`

export default function InteractionBar() {
    const files = useFiles()
    const [selectedFiles, setSelectedFiles] = useAtom(selectedFilesAtom)

    const selectedAll = useMemo(() => {
        return selectedFiles.length > 0 && files.every(file => selectedFiles.some(selectedFile => selectedFile.id === file.id))
    }, [files, selectedFiles])

    useEffect(() => () => { setSelectedFiles([]) }, [])

    const [showTags, setShowTags] = useState(false)

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
            Select All
        </Item>
        <Item
            onClick={() => {
                for (const file of selectedFiles) {
                    deleteFile(file)
                }
                setSelectedFiles([])
            }}>
            Delete
        </Item>
        <Item
            onClick={() => selectedFiles.length > 0 && downloadFiles(selectedFiles)}>
            Download
        </Item>
        <Item
            onClick={() => {
                for (const file of selectedFiles) {
                    markFile(file)
                }
            }}>
            Mark
        </Item>
        <Item
            onClick={() => {
                for (const file of selectedFiles) {
                    favoriteFile(file)
                }
            }}>
            Favotire
        </Item>
        <Item
            onClick={() => setShowTags(!showTags)}>
            Tag
            {showTags &&
                <TagList
                    onHide={() => setShowTags(false)}
                    onSelectTag={tag => {
                        for (const file of selectedFiles) {
                            tagFile(file, tag)
                        }
                        setShowTags(false)
                    }} />}
        </Item>
    </Container>
}