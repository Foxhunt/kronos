import firebase from "../../firebase/clientApp"

import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import dynamic from "next/dynamic"
import Image from "next/image"

import { useAtom } from "jotai"
import {
    previewFileAtom
} from "../../store"
import { useClickedOutside } from "../../hooks"

const PDFViewer = dynamic(import("./PDFViewer"), { ssr: false })

const Container = styled.div`
    position: fixed;
    background-color: #dcdce1;
    top: 30px;
    left: 0px;

    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
`

const Preview = styled(motion.div)`
    position: absolute;
    width: 100%;
    height: 100%;
    
    display: flex;
    justify-content: center;
    align-items: center;

    & > * {
        pointer-events: none
    }
`

const ArrowLeft = styled.div`
    position: absolute;
    z-index: 1;

    left: 0px;
`

const ArrowRight = styled.div`
    position: absolute;
    z-index: 1;

    right: 0px;
`

const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
}

const variants = {
    enter: (direction: number) => {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => {
        return {
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        }
    }
}

interface props {
    files: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>[]
}

export default function FilePreview({ files }: props) {
    const [previewFile, setPreviewfile] = useAtom(previewFileAtom)

    const [src, setSrc] = useState("")
    useEffect(() => {
        setSrc(previewFile?.get("renderedPDF.800") || previewFile?.get("downloadURL"))
    }, [previewFile])

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

    const containerRef = useRef<HTMLDivElement>(null)
    useClickedOutside(containerRef, () => {
        setPreviewfile(undefined)
    })

    useEffect(() => {
        function handleKeydown(event: KeyboardEvent) {
            if (previewFile) {
                const currentIndex = files.map(file => file.id).indexOf(previewFile.id)
                switch (event.key) {
                    case "ArrowLeft":
                        setDirection(-1)
                        setPreviewfile(files[currentIndex - 1 < 0 ? files.length - 1 : currentIndex - 1])
                        break
                    case "ArrowRight":
                        setDirection(1)
                        setPreviewfile(files[(currentIndex + 1) % files.length])
                        break
                }
            }
        }
        window.addEventListener("keydown", handleKeydown)
        return () => window.removeEventListener("keydown", handleKeydown)
    }, [previewFile, files])

    const [direction, setDirection] = useState(0)
    const [isDragging, setDragging] = useState(false)

    return <Container
        ref={containerRef}
        onClick={() => !isDragging && setPreviewfile(undefined)}>
        <AnimatePresence
            initial={false}
            custom={direction}>
            <Preview
                key={previewFile?.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                }}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragStart={() => setDragging(true)}
                onDragEnd={(_, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x)
                    if (swipe < -swipeConfidenceThreshold) {
                        if (previewFile) {
                            const currentIndex = files.map(file => file.id).indexOf(previewFile.id)
                            setDirection(+1)
                            setPreviewfile(files[(currentIndex + 1) % files.length])
                        }
                    } else if (swipe > swipeConfidenceThreshold) {
                        if (previewFile) {
                            const currentIndex = files.map(file => file.id).indexOf(previewFile.id)
                            setDirection(-1)
                            setPreviewfile(files[currentIndex - 1 < 0 ? files.length - 1 : currentIndex - 1])
                        }
                    }
                    setTimeout(() => setDragging(false), 0)
                }}>
                {
                    isPDF ?
                        src && <PDFViewer
                            fileDocSnap={previewFile}
                            src={src}
                            height={800} />
                        :
                        src && <Image
                            src={src}
                            height={800}
                            width={800}
                            unoptimized
                            layout={"intrinsic"}
                            objectFit="contain" />
                }
            </Preview>
        </AnimatePresence>
        <ArrowLeft
            onClick={event => {
                event.stopPropagation()
                if (previewFile) {
                    const currentIndex = files.map(file => file.id).indexOf(previewFile.id)
                    setPreviewfile(files[currentIndex - 1 < 0 ? files.length - 1 : currentIndex - 1])
                    setDirection(-1)
                }
            }}>
            Prev
        </ArrowLeft>
        <ArrowRight
            onClick={event => {
                event.stopPropagation()
                if (previewFile) {
                    const currentIndex = files.map(file => file.id).indexOf(previewFile.id)
                    setPreviewfile(files[(currentIndex + 1) % files.length])
                    setDirection(+1)
                }
            }}>
            Next
        </ArrowRight>
    </Container>
}