import { useEffect, useState } from "react"
import styled from "styled-components"

import firebase from "../firebase/clientApp"

const Container = styled.div.attrs<{ background?: string }>
    (({ background }) => ({
        style: {
            backgroundImage: `url(${background})`
        }
    })) <{ background?: string }>`
    background-color: black;

    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    width: 200px;
    height: 200px;

    color: white;

    > * {
        width: 100%;
        height: calc(100% - 18px);
    }
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
            {metaData?.name}
            {
                isPDF &&
                <object data={src} type="application/pdf">
                    <embed src={src} type="application/pdf" />
                </object>
            }
        </Container>
    </>
}
