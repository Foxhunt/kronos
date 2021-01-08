import firebase from "../../firebase/clientApp"

import { useEffect, useState } from "react"
import styled from "styled-components"
import { motion, Variants } from "framer-motion"
import dynamic from "next/dynamic"
import Image from "next/image"


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

    & > div:first-child {
        filter: drop-shadow(-10px 10px 5px rgb(150, 150, 150));
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
    const [src, setSrc] = useState("")
    useEffect(() => {
        setSrc(fileDocSnap.get("renderedPDF.300") || fileDocSnap.get("downloadURL"))
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
                duration: 0.5
            }
        }
    }

    return <Container
        selected={selected}
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
                src && <PDFViewer
                    fileDocSnap={fileDocSnap}
                    src={src}
                    height={300} />
                :
                src && <Image
                    src={src}
                    height={300}
                    width={300}
                    unoptimized
                    layout={"intrinsic"}
                    objectFit="contain" />
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
    </Container>
}
