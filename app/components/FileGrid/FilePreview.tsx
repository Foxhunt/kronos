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
    position: absolute;
    top: 31px;

    width: 100%;
    height: calc(100% - 31px);

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #e9e9e9;
    
    & > div:first-child {
        filter: drop-shadow(-10px 10px 5px rgb(150, 150, 150));
    }
`

export default function FilePreview() {
    const [previewFile, setPreviewfile] = useAtom(previewFileAtom)

    const [src, setSrc] = useState<string>("")
    const [metaData, setMetaData] = useState<firebase.storage.FullMetadata>()
    useEffect(() => {
        async function fetchFile() {
            const storage = firebase.storage()
            const fullPath = previewFile?.get("renderedPDF.700") || previewFile?.get("fullPath")
            const fileRef = storage.ref(fullPath)
            const downloadURL = await fileRef.getDownloadURL()
            const metaData = await fileRef.getMetadata()

            setSrc(downloadURL)
            setMetaData(metaData)
        }

        fetchFile()
    }, [previewFile])

    const isPDF = metaData?.contentType === "application/pdf"

    const containerRef = useRef<HTMLDivElement>(null)
    useClickedOutside(containerRef, () => {
        setPreviewfile(undefined)
    })

    return <Container
        onClick={() => setPreviewfile(undefined)}>
        {
            isPDF ?
                <PDFViewer
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