import { useState, useCallback } from "react"
import Head from "next/head"
import styled from "styled-components"
import { useDropzone } from "react-dropzone"

import { useAtom } from "jotai"
import { filesToUploadAtom, userDocRefAtom } from "../store"

import CollectionList from "../components/CollectionList"

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

export default function files() {
    const [userDocRef] = useAtom(userDocRefAtom)

    const [, setFilesToUpload] = useAtom(filesToUploadAtom)

    const [dropTargetPosition, setDropTargetPosition] = useState({ x: 0, y: 0 })
    const onDragOver = useCallback((event) => {
        setDropTargetPosition({ x: event.pageX, y: event.pageY })
    }, [])

    const { getRootProps, isDragActive } = useDropzone({ onDrop: setFilesToUpload, onDragOver })

    return <>
        <Head>
            <title>Index</title>
            <link rel="shortcut icon" href="/list.svg" />
        </Head>
        {userDocRef &&
            <CollectionList
                getRootProps={getRootProps} />
        }
        {isDragActive &&
            <DropTarget
                targetPosition={dropTargetPosition} />
        }
    </>
}
