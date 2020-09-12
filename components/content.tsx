import { useCallback, useState } from "react"
import styled from "styled-components"
import { useDropzone } from "react-dropzone"

import File from "./file"

const Container = styled.div`
    text-align: center;
    outline: none;
    position: relative;
    overflow: hidden;
    grid-area: content;
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
    width: 50px;
    height: 50px;
    pointer-events: none;
`

export default function Content() {
    
    const [files, setFiles] = useState<File[]>([])
    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(async file => {
            console.log(file)
            if (!files.some(_file => _file.name === file.name)) {
                files.push(file)
                setFiles(files.concat())
            }
        })
    }, [])

    // position drop object
    const [dropTargetPosition, setDropTargetPosition] = useState({ x: 0, y: 0 })
    const onDragOver = useCallback(({ nativeEvent }) => {
        setDropTargetPosition({ x: nativeEvent.offsetX, y: nativeEvent.offsetY })
    }, [])

    const { getRootProps, isDragActive } = useDropzone({ onDrop, onDragOver })

    return (<Container {...getRootProps({})}>
        {files.map(
            file =>
                <File
                    key={file.name + file.lastModified + file.size}
                    file={file} />
        )}
        {isDragActive && <DropTarget targetPosition={dropTargetPosition} />}
    </Container>)
}
