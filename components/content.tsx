import { useCallback, useMemo, useState, useEffect } from "react"
import styled from "styled-components"
import { useDropzone } from "react-dropzone"

import firebase from "../firebase/clientApp"

import File from "./file"

const Container = styled.div`
    text-align: center;
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

    const [files, setFiles] = useState<firebase.storage.Reference[]>([])

    useEffect(() => {
        const storageRef = firebase.storage().ref()
        const listRef = storageRef.child("images")
        listRef.listAll().then( res => {
            setFiles(res.items)
        })
    }, [])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(async file => {
            if (!files.some(_file => _file.name === file.name)) {

                const storageRef = firebase.storage().ref()
                const fileRef = storageRef.child(`images/${file.name}`)

                const snapshot = await fileRef.put(file)

                files.push(snapshot.ref)
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
        reference =>
            <File
                key={reference.name}
                reference={reference} />
    ), [files])

    return <>
        <Container {...getRootProps({})}>
            {fileList}
        </Container>
        {isDragActive && <DropTarget targetPosition={dropTargetPosition} />}
    </>
}
