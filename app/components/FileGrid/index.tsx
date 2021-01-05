import firebase from "../../firebase/clientApp"
import deleteFile from "../../firebase/deleteFile"

import { useMemo } from "react"
import styled from "styled-components"
import { motion, Variants } from "framer-motion"
import { DropzoneRootProps } from "react-dropzone"

import { useAtom } from "jotai"
import { previewFileAtom, selectedFilesAtom, showInteractionBarAtom } from "../../store"

import FileComponent from "./FileComponent"
import FilePreview from "./FilePreview"

const Container = styled(motion.div)`
    position: relative;

    padding: 16px 0px;
    outline: none;

    display: grid;
    grid-template-columns: repeat(auto-fit, 450px);
    grid-template-rows: repeat(auto-fill, 400px);
    gap: 16px;

    justify-content: center;

    overflow-y: auto;
`

type props = {
    files: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>[]
    getRootProps?: (props?: DropzoneRootProps) => DropzoneRootProps
}

export default function FileGrid({ files, getRootProps }: props) {
    const [selectedFiles, setSelectedFiles] = useAtom(selectedFilesAtom)
    const [showInteractionBar] = useAtom(showInteractionBarAtom)
    const [, setPreviewFile] = useAtom(previewFileAtom)

    const fileList = useMemo(() => files.map(
        fileDocSnap =>
            <FileComponent
                fileDocSnap={fileDocSnap}
                selected={selectedFiles.some(selectedFile => selectedFile.id === fileDocSnap.id)}
                onSelect={() => {
                    if (showInteractionBar) {
                        if (!selectedFiles.some(selectedFile => selectedFile.id === fileDocSnap.id)) {
                            setSelectedFiles([...selectedFiles, fileDocSnap])
                        } else {
                            setSelectedFiles(selectedFiles.filter(selectedFile => selectedFile.id !== fileDocSnap.id))
                        }
                    } else {
                        setPreviewFile(fileDocSnap)
                    }
                }}
                onDelete={() => deleteFile(fileDocSnap)}
                key={fileDocSnap.id} />
    ), [files, selectedFiles, showInteractionBar])

    const variants: Variants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const [previewFile] = useAtom(previewFileAtom)

    // @ts-ignore
    return <Container
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={variants}
        {...(getRootProps ? getRootProps({}) : {})}>
        {fileList}
        {previewFile && <FilePreview />}
    </Container>
}
