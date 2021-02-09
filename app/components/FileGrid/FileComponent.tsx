import firebase from "../../firebase/clientApp"

import { useEffect, useState } from "react"
import styled from "styled-components"
import { motion, Variants } from "framer-motion"
import dynamic from "next/dynamic"
import Circle from "../Shared/Circle"
import { useAtom } from "jotai"
import { showInteractionBarAtom } from "../../store"

const PDFViewer = dynamic(import("./PDFViewer"), { ssr: false })

const Image = styled.img`
    object-fit: contain;
    width: 100%;
    height: 100%;
`

const Container = styled(motion.div) <{ selected: boolean, top: number }>`
    position: relative;
    background-color: #dcdce1;

    max-height: calc(100vh - ${({ top }) => top}px);
    aspect-ratio: 5/6;

    padding: 30px;

    box-sizing: border-box;

    ${({ selected }) => selected ? `
        border: 3px solid #fb2dfb;
    ` : ""}

    display: flex;
    justify-content: center;
    align-items: center;
    
    overflow: hidden;
`

const Details = styled(motion.div) <{ selected: boolean }>`
    position: absolute;
    bottom: ${({ selected }) => selected ? 2 : 5}px;

    width: 75%;

    font-size: 11px;

    display: flex;
    align-items: center;
    justify-content: center;
`

const Name = styled.div`
    display: inline;
    margin-right: 5px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: initial;
`

type props = {
    top: number
    fileDocSnap: firebase.firestore.DocumentSnapshot
    selected: boolean
    onSelect?: () => void
    onDelete?: () => void
}

export default function FileComponent({ top, fileDocSnap, selected, onSelect, onDelete }: props) {
    const [src, setSrc] = useState("")
    useEffect(() => {
        setSrc(fileDocSnap.get("renderedPDF.310") || fileDocSnap.get("downloadURL"))
    }, [fileDocSnap])

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
                duration: 0.2
            }
        }
    }

    const [isHovered, setHovered] = useState(false)
    const [showInteractionBar] = useAtom(showInteractionBarAtom)

    return <Container
        top={top}
        selected={selected}
        variants={variants}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => {
            onSelect && onSelect()

            const array = new Uint32Array(10)
            window.crypto.getRandomValues(array)
            fileDocSnap.ref.update({ random: array[array[0] % array.length] })
        }}
        onContextMenu={event => {
            event.preventDefault()
            onDelete && onDelete()
        }}>
        {
            isPDF ?
                src && <PDFViewer
                    fileDocSnap={fileDocSnap}
                    src={src}
                    height={310} />
                :
                src && <Image
                    src={src} />
        }
        <Details
            initial="hidden"
            animate={(isHovered || showInteractionBar) ? "visible" : "hidden"}
            variants={variants}
            selected={selected}>
            <Name>{fileDocSnap.get("name")}</Name>
            <Circle
                stroke="#0501ff"
                fill={fileDocSnap.get("favorite") ? "#0501ff" : "#00000000"}
                onClick={event => {
                    event.stopPropagation()
                    fileDocSnap.ref.update({
                        favorite: !fileDocSnap.get("favorite")
                    })
                }}
            />
            <Circle
                stroke="#33bd27"
                fill={fileDocSnap.get("marked") ? "#33bd27" : "#00000000"}
                onClick={event => {
                    event.stopPropagation()
                    fileDocSnap.ref.update({
                        marked: !fileDocSnap.get("marked")
                    })
                }}
            />
        </Details>
    </Container>
}
