import firebase from "../../firebase/clientApp"

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

const Container = styled(motion.div) <{ selected: boolean }>`
    position: relative;
    background-image: linear-gradient(90deg, #d4d4d4, #eeeeee);

    height: 400px;

    ${({ selected }) => selected ? `
        border: 3px solid #fb2dfb;
        margin: -3px;
    ` : ""}

    display: flex;
    justify-content: center;
    align-items: center;
    
    overflow: hidden;

    & div:first-child {
        box-shadow: -10px 10px 5px 0px #b5b5b5;
    }
`

const Name = styled.div`
    position: absolute;
    bottom: 0px;

    color: red;
`

type props = {
    fileDocSnap: firebase.firestore.DocumentSnapshot
    selected: boolean
    onSelect?: () => void
    onDelete?: () => void
}

export default function FileComponent({ fileDocSnap, selected, onSelect, onDelete }: props) {
    const [src, setSrc] = useState<string>("")
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

    const [showOverlay] = useState(false)

    return <Container
        selected={selected}
        layout
        variants={variants}
        onClick={() => {
            onSelect && onSelect()
        }}
        onContextMenu={event => {
            event.preventDefault()
            onDelete && onDelete()
        }}>
        {
            isPDF ?
                <PDFViewer
                    file={src}
                    height={300} />
                :
                src && <StyledImage
                    src={src}
                    width={300}
                    height={300} />
        }
        <Name>
            {fileDocSnap.get("name")}
            <input
                type="checkbox"
                checked={fileDocSnap.get("favorite")}
                onClick={event => {
                    event.stopPropagation()
                }}
                onChange={event => {
                    fileDocSnap.ref.update({
                        favorite: event.target.checked
                    })
                }} />
            <input
                type="checkbox"
                checked={fileDocSnap.get("marked")}
                onClick={event => {
                    event.stopPropagation()
                }}
                onChange={event => {
                    fileDocSnap.ref.update({
                        marked: event.target.checked
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
