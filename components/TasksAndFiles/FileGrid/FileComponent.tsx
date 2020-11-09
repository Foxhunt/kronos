import firebase from "../../../firebase/clientApp"

import { useEffect, useState } from "react"
import styled from "styled-components"
import { motion, Variants } from "framer-motion"
import dynamic from "next/dynamic"
import Image from "next/image"

const StyledImage = styled(Image)`
    object-fit: cover;
`

const PDFViewer = dynamic(import("./PDFViewer"), { ssr: false })

const Container = styled(motion.div)`
    position: relative;
    background-color: black;

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

    const variants: Variants = {
        hidden: {
            opacity: 0,
            transition: {
                duration: 0.5
            }
        },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    }

    return <Container
        layout
        variants={variants}
        onContextMenu={event => {
            event.preventDefault()
            onDelete && onDelete()
        }}>
        {
            isPDF ?
                <PDFViewer file={src} />
                :
                src && <StyledImage
                    src={src}
                    width={300}
                    height={300} />
        }
        <Name>{metaData?.name}</Name>
    </Container>
}
