import { useCallback, useState } from "react"
import styled from "styled-components"
import { useDropzone } from "react-dropzone"


const Container = styled.div<{ isDragActive: boolean }>`
    background-color: ${({ isDragActive }) => isDragActive ? "green" : "red"};
    text-align: center;
    outline: none;
    position: relative;
    overflow: hidden;
`

const DropTarget = styled.div.attrs<{ targetPosition: { x: number, y: number } }>(({ targetPosition }) => ({
    style: {
        transform: `translate(calc(${targetPosition.x}px - 50%), calc(${targetPosition.y}px - 50%))`
    }
})) <{ targetPosition: { x: number, y: number } }>`
    background-color: white;
    position: absolute;
    top: 0px;
    width: 50px;
    height: 50px;
    pointer-events: none;
`

export default function Content() {
    // upload files
    const [files, setFiles] = useState<File[]>([])
    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            console.log(file)
            if (!files.some(_file => _file.name === file.name)) {
                files.push(file)
                setFiles(files.concat())

                const reader = new FileReader()

                reader.onabort = () => console.log("file reading was aborted")
                reader.onerror = () => console.log("file reading has failed")
                reader.onload = () => {
                    // Do whatever you want with the file contents
                    //const binaryStr = reader.result
                    //console.log(binaryStr)
                }
                reader.readAsText(file)
            }
        })
    }, [])

    // position drop object
    const [dropTargetPosition, setDropTargetPosition] = useState({ x: 0, y: 0 })
    const onDragOver = useCallback(({ nativeEvent }) => {
        setDropTargetPosition({ x: nativeEvent.offsetX, y: nativeEvent.offsetY })
    }, [])

    const { getRootProps, isDragActive } = useDropzone({ onDrop, onDragOver })

    return (<Container {...getRootProps({})} isDragActive={isDragActive}>
        Content
        {files.map(({ name, lastModified, size }) => {
            return <div key={name + lastModified + size}>{name}</div>
        })}
        {isDragActive && <DropTarget targetPosition={dropTargetPosition} />}
    </Container>)
}
