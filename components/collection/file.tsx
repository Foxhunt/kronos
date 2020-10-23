import { useEffect, useState } from "react"
import styled from "styled-components"
import dynamic from "next/dynamic"

import firebase from "../../firebase/clientApp"

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

    width: 100%;
    height: 100%;

    display: flex;

    justify-content: center;
`

const Name = styled.div`
    position: absolute;
    bottom: 0px;

    color: red;
`

type FileProps = { fullPath: string, onDelete: () => void }

export default function FileComponent({ fullPath, onDelete }: FileProps) {
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

    return <>
        <Container
            onClick={onDelete}
            background={isPDF ? "" : src}>
            {isPDF && <PDFViewer file={src} />}
            <Name>{metaData?.name}</Name>
        </Container>
    </>


}
