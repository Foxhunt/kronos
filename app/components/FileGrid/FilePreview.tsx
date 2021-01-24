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
    background-image: linear-gradient(70deg,#b3b3b3,#e4e4e4);
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
        /* filter: drop-shadow(-10px 10px 5px rgb(150, 150, 150)); */
    }
`

export default function FilePreview() {
    const [previewFile, setPreviewfile] = useAtom(previewFileAtom)

    const [src, setSrc] = useState("")
    useEffect(() => {
        setSrc(previewFile?.get("renderedPDF.700") || previewFile?.get("downloadURL"))
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

    return <Container
        ref={containerRef}
        onClick={() => setPreviewfile(undefined)}>
        {
            isPDF ?
                src && <PDFViewer
                    fileDocSnap={previewFile}
                    src={src}
                    height={700} />
                :
                src && <Image
                    src={src}
                    height={700}
                    width={700}
                    unoptimized
                    layout={"intrinsic"}
                    objectFit="contain" />
        }
    </Container>
}