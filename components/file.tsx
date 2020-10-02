import { useEffect, useState } from "react"
import styled from "styled-components"
import { Document, Page, pdfjs } from "react-pdf"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

import firebase from "../firebase/clientApp"

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

    width: 200px;
    height: 200px;

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
            {
                isPDF &&
                <Document file={src}>
                    <Page
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        height={200}
                        pageNumber={1} />
                </Document>
            }
            <Name>{metaData?.name}</Name>
        </Container>
    </>
}
