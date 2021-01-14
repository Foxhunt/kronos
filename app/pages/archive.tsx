import React, { useCallback, useState } from "react"
import Head from "next/head"
import styled from "styled-components"
import { useDropzone } from "react-dropzone"

import { useAtom } from "jotai"
import {
    filesToUploadAtom,
    filterFavoriteAtom,
    filterMarkedAtom,
    filterOrderByAtom,
    filterTagsAtom,
    selectedClientDocRefAtom,
    selectedCollectionDocRefAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
    showInteractionBarAtom,
    userDocRefAtom
} from "../store"

import { useFiles } from "../hooks"

import BoardBar from "../components/BoardBar"
import InteractionBar from "../components/InteractionBar"
import FileGrid from "../components/FileGrid"

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

export default function Archive() {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [client] = useAtom(selectedClientDocRefAtom)
    const [project] = useAtom(selectedProjectDocRefAtom)
    const [task] = useAtom(selectedTaskDocRefAtom)
    const [collection] = useAtom(selectedCollectionDocRefAtom)

    const [orderOptions] = useAtom(filterOrderByAtom)
    const [favorite] = useAtom(filterFavoriteAtom)
    const [marked] = useAtom(filterMarkedAtom)
    const [tags] = useAtom(filterTagsAtom)

    const files = useFiles(client, project, task, collection, Infinity, orderOptions, favorite, marked, tags)

    const [, setFilesToUpload] = useAtom(filesToUploadAtom)

    const [dropTargetPosition, setDropTargetPosition] = useState({ x: 0, y: 0 })
    const onDragOver = useCallback((event) => {
        setDropTargetPosition({ x: event.pageX, y: event.pageY })
    }, [])

    const { getRootProps, isDragActive } = useDropzone({ onDrop: setFilesToUpload, onDragOver })

    const [showInteractionBar] = useAtom(showInteractionBarAtom)

    return <>
        <Head>
            <title>Archive</title>
            <link rel="shortcut icon" href="/grid.svg" />
        </Head>
        {showInteractionBar && <InteractionBar />}
        {task &&
            <BoardBar />
        }
        {userDocRef &&
            <FileGrid
                files={files}
                getRootProps={getRootProps} />
        }
        {isDragActive &&
            <DropTarget
                targetPosition={dropTargetPosition} />
        }
    </>
}
