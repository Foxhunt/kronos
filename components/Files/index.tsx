import React, { useCallback, useState } from "react"
import styled from "styled-components"
import { useDropzone } from "react-dropzone"

import pLimit from "p-limit"

import uploadFile from "../../firebase/uploadFile"

import useFilteredFiles from "../hooks/useFilteredFiles"

import { useAtom } from "jotai"
import {
    selectedClientDocRefAtom,
    selectedCollectionDocRefAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
    userDocRefAtom
} from "../../store"
import LocationAndFolders from "./LocationAndFolders"

import FileGrid from "../FileGrid"

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

export default function Files() {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [client] = useAtom(selectedClientDocRefAtom)
    const [project] = useAtom(selectedProjectDocRefAtom)
    const [task] = useAtom(selectedTaskDocRefAtom)
    const [collection] = useAtom(selectedCollectionDocRefAtom)

    const files = useFilteredFiles()

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const PDFDocument = (await import("pdf-lib")).PDFDocument

        const limit = pLimit(5)

        if (client && project && task && collection && userDocRef) {
            acceptedFiles
                .filter(newFile => !files.some(existingFile => existingFile.get("name") === newFile.name))
                .map(newFile => limit(async () => {
                    // we want to split PDFs into pages and upload them individualy
                    if (newFile.type === "application/pdf") {
                        const pdf = await PDFDocument.load(await newFile.arrayBuffer())
                        const pageIndicies = pdf.getPageIndices()

                        // map convert and upload tasks
                        pageIndicies.map(i => limit(async () => {

                            const newFilePageName = `${newFile.name.substring(0, newFile.name.lastIndexOf(".pdf"))}-${i}.pdf`

                            if (!files.some(existingFile => existingFile.get("name") === newFilePageName)) {
                                const extractedPagePDF = await PDFDocument.create()
                                const [page] = await extractedPagePDF.copyPages(pdf, [i])
                                extractedPagePDF.addPage(page)
                                const pdfFile = new File(
                                    [await extractedPagePDF.save()],
                                    newFilePageName,
                                    { type: "application/pdf" }
                                )

                                await uploadFile(pdfFile, client, project, task, collection, userDocRef)
                            }
                        }))
                    } else {
                        await uploadFile(newFile, client, project, task, collection, userDocRef)
                    }
                }))
        }
    }, [userDocRef, files, collection])

    // position drop object
    const [dropTargetPosition, setDropTargetPosition] = useState({ x: 0, y: 0 })
    const onDragOver = useCallback((event) => {
        setDropTargetPosition({ x: event.pageX, y: event.pageY })
    }, [])

    const { getRootProps, isDragActive } = useDropzone({ onDrop, onDragOver })

    return <>
        {userDocRef ? <LocationAndFolders /> : null}
        <FileGrid
            files={files}
            getRootProps={getRootProps} />
        {isDragActive && collection && <DropTarget targetPosition={dropTargetPosition} />}
    </>
}
