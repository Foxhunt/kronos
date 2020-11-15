import firebase from "../../../firebase/clientApp"

import { useEffect, useState } from "react"
import styled from "styled-components"
import { AnimatePresence, motion, Variants } from "framer-motion"
import dynamic from "next/dynamic"
import Image from "next/image"

import Overlay from "./Overlay"

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
    fileDocSnap: firebase.firestore.DocumentSnapshot
    onDelete?: () => void
}

export default function FileComponent({ fileDocSnap, onDelete }: props) {
    const [src, setSrc] = useState<string>("")
    const [showOverlay, setShowOverlay] = useState(false)
    const [metaData, setMetaData] = useState<firebase.storage.FullMetadata>()
    useEffect(() => {
        async function fetchFile() {
            const storage = firebase.storage()
            const fileRef = storage.ref(fileDocSnap.get("fullPath"))
            const downloadURL = await fileRef.getDownloadURL()
            const metaData = await fileRef.getMetadata()

            setSrc(downloadURL)
            setMetaData(metaData)
        }

        fetchFile()
    }, [fileDocSnap])

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
        onHoverStart={() => {
            setShowOverlay(true)
        }}
        onHoverEnd={() => {
            setShowOverlay(false)
        }}
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
        <Name>
            {metaData?.name}
            <input
                type="checkbox"
                checked={fileDocSnap.get("favorite")}
                onChange={event => {
                    fileDocSnap.ref.update({
                        favorite: event.target.checked
                    })
                }} />
        </Name>
        <AnimatePresence>
            {showOverlay &&
                <Overlay
                    fileDocSnap={fileDocSnap} />}
        </AnimatePresence>
    </Container>
}
