import { useCallback, useMemo, useState, useEffect } from "react"
import styled from "styled-components"
import { useDropzone } from "react-dropzone"

import firebase from "../firebase/clientApp"
import uploadFile from "../firebase/uploadFile"

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

    const [files, setFiles] = useState<firebase.firestore.DocumentSnapshot[]>([])

    useEffect(() => {
        const db = firebase.firestore()
        const imageCollection = db.collection("images")

        const unsubscribe = imageCollection.onSnapshot(snapshot => {
            setFiles(snapshot.docs)
        })

        return unsubscribe
    }, [])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(async file => {
            if (!files.some(_file => _file.get("name") === file.name)) {

                const fileRef = await uploadFile(file)

                files.push(fileRef)
                setFiles(files.concat())

                firebase.analytics().logEvent("upload_file", {
                    name: fileRef.get("name"),
                    fullPath: fileRef.get("fullPath")
                })
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
        fileSnapshot =>
            <File
                key={fileSnapshot.get("name")}
                onDelete={() => {
                    fileSnapshot.ref.delete().then(() => {
                        const storage = firebase.storage()
                        const fileRef = storage.ref(fileSnapshot.get("fullPath"))
                        fileRef.delete()

                        firebase.analytics().logEvent("delete_file", {
                            name: fileSnapshot.get("name"),
                            fullPath: fileSnapshot.get("fullPath")
                        })
                    })
                }}
                fullPath={fileSnapshot.get("fullPath")} />
    ), [files])

    return <>
        <Container {...getRootProps({})}>
            {fileList}
        </Container>
        {isDragActive && <DropTarget targetPosition={dropTargetPosition} />}
    </>
}
