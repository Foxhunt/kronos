import { useCallback, useMemo, useState, useEffect } from "react"
import styled from "styled-components"
import { useDropzone } from "react-dropzone"

import pLimit from "p-limit"

import firebase from "../../firebase/clientApp"
import uploadFile from "../../firebase/uploadFile"

import FileComponent from "./file"
import { useAtom } from "jotai"
import {
    selectedClientDocRefAtom,
    selectedCollectionDocRefAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
    userDocRefAtom
} from "../../store"

const Container = styled.div`
    text-align: center;
    outline: none;
    position: relative;
    grid-area: content;

    padding: 16px;

    display: grid;
    grid-template-columns: repeat(auto-fit, 300px);
    grid-template-rows: repeat(auto-fit, 300px);
    gap: 16px;
    justify-items: start;
    align-items: start;
    height: 100%;
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

export default function Files() {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [client] = useAtom(selectedClientDocRefAtom)
    const [project] = useAtom(selectedProjectDocRefAtom)
    const [task] = useAtom(selectedTaskDocRefAtom)
    const [collection] = useAtom(selectedCollectionDocRefAtom)

    const [files, setFiles] = useState<firebase.firestore.DocumentSnapshot[]>([])

    useEffect(() => {
        if (userDocRef && client && project && task && collection) {
            const unsubscribe = userDocRef
                .collection("files")
                .where("client", "==", client?.ref)
                .where("project", "==", project?.ref)
                .where("task", "==", task?.ref)
                .where("collection", "==", collection?.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setFiles(snapshot.docs)
                })

            return unsubscribe
        }
        if (userDocRef && client && project && task) {
            const unsubscribe = userDocRef
                .collection("files")
                .where("client", "==", client?.ref)
                .where("project", "==", project?.ref)
                .where("task", "==", task?.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setFiles(snapshot.docs)
                })

            return unsubscribe
        }
        if (userDocRef && client && project) {
            const unsubscribe = userDocRef
                .collection("files")
                .where("client", "==", client?.ref)
                .where("project", "==", project?.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setFiles(snapshot.docs)
                })

            return unsubscribe
        }
        if (userDocRef && client) {
            const unsubscribe = userDocRef
                .collection("files")
                .where("client", "==", client?.ref)
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setFiles(snapshot.docs)
                })

            return unsubscribe
        }

        const unsubscribe = userDocRef
            ?.collection("files")
            .orderBy("createdAt", "desc")
            .onSnapshot(snapshot => {
                setFiles(snapshot.docs)
            })

        return unsubscribe
    }, [userDocRef, client, project, task, collection])

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const PDFDocument = (await import("pdf-lib")).PDFDocument

        const limit = pLimit(5)

        if (
            userDocRef &&
            client &&
            project &&
            task &&
            collection
        ) {
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

    const fileList = useMemo(() => files.map(
        fileSnapshot =>
            <FileComponent
                key={fileSnapshot.id}
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
