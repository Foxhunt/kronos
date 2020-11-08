import firebase from "../../../firebase/clientApp"

import { useEffect, useState } from "react"
import styled from "styled-components"
import dynamic from "next/dynamic"

const PDFViewer = dynamic(import("./PDFViewer"), { ssr: false })

const Container = styled.div.attrs<{ background?: string }>
    (({ background }) => ({
        style: {
            backgroundImage: `url(${background})`
        }
    })) <{ background?: string }>`
    position: relative;
    background-color: black;

    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    width: 300px;
    height: 300px;

    display: flex;
    justify-content: center;
    
    overflow: hidden;
`

const Name = styled.div`
    position: absolute;
    bottom: 0px;

    color: red;
`

type props = {
    fullPath: string
    onDelete?: () => void
}

export default function FileComponent({ fullPath, onDelete }: props) {
    const [src, setSrc] = useState<string>("")
    const [metaData, setMetaData] = useState<firebase.storage.FullMetadata>()
    useEffect(() => {
        async function fetchFile() {
            const storage = firebase.storage()
            const fileRef = storage.ref(fullPath)
            const downloadURL = await fileRef.getDownloadURL()
            const metaData = await fileRef.getMetadata()

            setSrc(downloadURL)
            setMetaData(metaData)
        }

        fetchFile()
    }, [fullPath])

    const isPDF = metaData?.contentType === "application/pdf"

    return <Container
        background={isPDF ? "" : src}
        onContextMenu={event => {
            event.preventDefault()
            onDelete && onDelete()
        }}>
        {isPDF && <PDFViewer file={src} />}
        <Name>{metaData?.name}</Name>
    </Container>
}
