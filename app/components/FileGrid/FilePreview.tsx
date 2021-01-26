import firebase from "../../firebase/clientApp"

import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import dynamic from "next/dynamic"
import Image from "next/image"

import { useAtom } from "jotai"
import {
    previewFileAtom
} from "../../store"
import { useClickedOutside } from "../../hooks"

const PDFViewer = dynamic(import("./PDFViewer"), { ssr: false })

const Container = styled.div`
    position: fixed;
    background-image: linear-gradient(45deg,#b3b3b3,#e4e4e4);
    background-color: #dcdce1;
    top: 30px;
    left: 0px;

    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #dcdce1;
    
    & > div:first-child {
        filter: drop-shadow(-10px 10px 5px rgb(150, 150, 150));
    }
`

const ArrowLeft = styled.div`
    position: absolute;
    left: 0px;
`

const ArrowRight = styled.div`
    position: absolute;
    right: 0px;
`

interface props {
    files: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>[]
}

export default function FilePreview({ files }: props) {
    const [previewFile, setPreviewfile] = useAtom(previewFileAtom)

    const [src, setSrc] = useState("")
    useEffect(() => {
        setSrc(previewFile?.get("renderedPDF.800") || previewFile?.get("downloadURL"))
    }, [previewFile])

    const [contentType, setContentType] = useState("")
    useEffect(() => {
        async function fetchContentType() {
            const fileRef = firebase.storage().refFromURL(src)
            setContentType((await fileRef.getMetadata()).contentType)
        }

        if (src !== "") {
            fetchContentType()
        }
    }, [src])

    const isPDF = contentType === "application/pdf"

    const containerRef = useRef<HTMLDivElement>(null)
    useClickedOutside(containerRef, () => {
        setPreviewfile(undefined)
    })

    useEffect(() => {
        function handleKeydown(event: KeyboardEvent) {
            if (previewFile) {
                const currentIndex = files.map(file => file.id).indexOf(previewFile.id)
                switch (event.key) {
                    case "ArrowLeft":
                        setPreviewfile(files[currentIndex - 1 < 0 ? files.length - 1 : currentIndex - 1])
                        break
                    case "ArrowRight":
                        setPreviewfile(files[(currentIndex + 1) % files.length])
                        break
                }
            }
        }

        window.addEventListener("keydown", handleKeydown)

        return () => window.removeEventListener("keydown", handleKeydown)
    }, [previewFile, files])

    return <Container
        ref={containerRef}
        onClick={() => setPreviewfile(undefined)}>
        {
            isPDF ?
                src && <PDFViewer
                    fileDocSnap={previewFile}
                    src={src}
                    height={800} />
                :
                src && <Image
                    src={src}
                    height={800}
                    width={800}
                    unoptimized
                    layout={"intrinsic"}
                    objectFit="contain" />
        }
        <ArrowLeft
            onClick={event => {
                event.stopPropagation()
                if (previewFile) {
                    const currentIndex = files.map(file => file.id).indexOf(previewFile.id)
                    setPreviewfile(files[currentIndex - 1 < 0 ? files.length - 1 : currentIndex - 1])
                }
            }}>
            Prev
        </ArrowLeft>
        <ArrowRight
            onClick={event => {
                event.stopPropagation()
                if (previewFile) {
                    const currentIndex = files.map(file => file.id).indexOf(previewFile.id)
                    setPreviewfile(files[(currentIndex + 1) % files.length])
                }
            }}>
            Next
            </ArrowRight>
    </Container>
}