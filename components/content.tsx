import { useCallback, useMemo, useState } from "react"
import styled from "styled-components"
import { useDropzone } from "react-dropzone"

import File from "./file"

const Container = styled.div`
    text-align: center;

    // wasdds
    outline: none;
    position: relative;
    grid-area: content;

    padding: 16px;

    display: grid;
    grid-template-columns: repeat(auto-fit, 200px);
    grid-template-rows: repeat(auto-fit, 200px);
    gap: 16px;
    justify-items: start;
    align-items: start;
`

const DropTarget = styled.div.attrs<{ targetPosition: { x: number, y: number } }>
    (({ targetPosition }) => ({
        style: {
            transform: `translate(calc(${targetPosition.x}px - 50%), calc(${targetPosition.y}px - 50%))`
        }
    })) <{ targetPosition: { x: number, y: number } }>`
    background-color: black;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 50px;
    height: 50px;
    pointer-events: none;
`

export default function Content() {

    const [files, setFiles] = useState<File[]>([])
    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(async file => {
            if (!files.some(_file => _file.name === file.name)) {
                files.push(file)
                setFiles(files.concat())
            }
        })
    }, [files])

    // position drop object
    const [dropTargetPosition, setDropTargetPosition] = useState({ x: 0, y: 0 })
    const onDragOver = useCallback((event) => {
        setDropTargetPosition({ x: event.pageX, y: event.pageY })
    }, [])

    const { getRootProps, isDragActive } = useDropzone({ onDrop, onDragOver })

    const fileList = useMemo(() => files.map(
        file =>
            <File
                removeFile={name => setFiles(files.filter(file => file.name != name))}
                key={file.name + file.lastModified + file.size}
                file={file} />
    ), [files])

    return <>
        <Container {...getRootProps({})}>
            {fileList}
        </Container>
        {isDragActive && <DropTarget targetPosition={dropTargetPosition} />}
    </>
}
