import firebase from "../../firebase/clientApp"

import { useEffect, useState } from "react"
import styled from "styled-components"
import { motion, Variants } from "framer-motion"
import dynamic from "next/dynamic"
import Image from "next/image"
import Circle from "../Shared/Circle"

const PDFViewer = dynamic(import("./PDFViewer"), { ssr: false })

const Container = styled(motion.div) <{ selected: boolean }>`
    position: relative;
    background-image: linear-gradient(45deg,#b3b3b3,#e4e4e4);
    background-color: #dcdce1;
    border-radius: 10px;

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
        filter: drop-shadow(-3px 3px 2px rgb(150,150,150))
    }

    &::before {
      content: "";
      display: block;
      height: 0;
      width: 0;
      padding-bottom: calc(9 / 16 * 100%);
    }
`

const Details = styled.div`
    position: absolute;
    bottom: 5px;

    display: flex;
    align-items: center;
`

const Name = styled.div`
    display: inline;
    margin-right: 5px;
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
        <Details>
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
