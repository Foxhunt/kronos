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
    top: 34px;

    width: 100%;
    height: calc(100% - 34px);

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #e9e9e9;
    
    & div:first-child {
        box-shadow: -10px 10px 5px 0px #b5b5b5;
    }
`

const StyledImage = styled(Image)`
    object-fit: cover;
`

export default function FilePreview() {
    const [previewFile, setPreviewfile] = useAtom(previewFileAtom)

    const [src, setSrc] = useState<string>("")
    const [metaData, setMetaData] = useState<firebase.storage.FullMetadata>()
    useEffect(() => {
        async function fetchFile() {
            const storage = firebase.storage()
            const fileRef = storage.ref(previewFile?.get("fullPath"))
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
                    file={src}
                    height={700} />
                :
                src && <StyledImage
                    src={src}
                    width={700}
                    height={700} />
        }
    </Container>
}