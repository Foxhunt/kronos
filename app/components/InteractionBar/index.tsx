import { useEffect, useMemo } from "react"
import deleteFile from "../../firebase/deleteFile"
import downloadFiles from "../../firebase/downloadFiles"
import favoriteFiles from "../../firebase/favoriteFiles"
import markFiles from "../../firebase/markFiles"

markFiles

import styled from "styled-components"

import { useAtom } from "jotai"
import { selectedFilesAtom } from "../../store"
import { useFiles } from "../../hooks"

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

const Filter = styled(Item)`
    margin-left: auto;
`

export default function InteractionBar() {
    const files = useFiles()
    const [selectedFiles, setSelectedFiles] = useAtom(selectedFilesAtom)

    const selectedAll = useMemo(() => {
        return selectedFiles.length > 0 && files.every(file => selectedFiles.some(selectedFile => selectedFile.id === file.id))
    }, [files, selectedFiles])

    useEffect(() => () => { setSelectedFiles([]) }, [])

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
                selectedFiles.forEach(file => deleteFile(file))
                setSelectedFiles([])
            }}>
            Delete
        </Item>
        <Item
            onClick={() => selectedFiles.length > 0 && downloadFiles(selectedFiles)}>
            Download
        </Item>
        <Item
            onClick={() => markFiles(selectedFiles)}>
            Mark
        </Item>
        <Item
            onClick={() => favoriteFiles(selectedFiles)}>
            Favotire
        </Item>
        <Item>Tag</Item>
        <Filter>Filter</Filter>
    </Container>
}