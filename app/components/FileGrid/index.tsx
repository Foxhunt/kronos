import firebase from "../../firebase/clientApp"
import deleteFile from "../../firebase/deleteFile"

import { useMemo } from "react"
import styled from "styled-components"
import { AnimatePresence, motion, Variants } from "framer-motion"
import { DropzoneRootProps } from "react-dropzone"

import { useAtom } from "jotai"
import { selectedFilesAtom, showInteractionBarAtom } from "../../store"

import FileComponent from "./FileComponent"

const Container = styled(motion.div)`
    flex: 1;
    grid-area: files;
    outline: none;
    
    padding: 16px;

    display: grid;
    grid-template-columns: repeat(auto-fit, 300px);
    grid-template-rows: repeat(auto-fit, 300px);
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

    const fileList = useMemo(() => files.map(
        fileDocSnap =>
            <FileComponent
                fileDocSnap={fileDocSnap}
                selected={selectedFiles.some(selectedFile => selectedFile.id === fileDocSnap.id)}
                interactionActive={showInteractionBar}
                onSelect={() => {
                    if (!selectedFiles.some(selectedFile => selectedFile.id === fileDocSnap.id)) {
                        setSelectedFiles([...selectedFiles, fileDocSnap])
                    } else {
                        setSelectedFiles(selectedFiles.filter(selectedFile => selectedFile.id !== fileDocSnap.id))
                    }
                }}
                onDelete={() => deleteFile(fileDocSnap)}
                key={fileDocSnap.id} />
    ), [files, selectedFiles, showInteractionBar])

    const variants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
            }
        }
    }

    // @ts-ignore
    return <Container
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={variants}
        {...(getRootProps ? getRootProps({}) : {})}>
        <AnimatePresence>
            {fileList}
        </AnimatePresence>
    </Container>
}
