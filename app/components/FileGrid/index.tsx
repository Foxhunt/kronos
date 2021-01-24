import firebase from "../../firebase/clientApp"
import deleteFiles from "../../firebase/deleteFiles"

import { useMemo } from "react"
import styled from "styled-components"
import { motion, Variants } from "framer-motion"
import { DropzoneRootProps } from "react-dropzone"

import { useAtom } from "jotai"
import {
    filesToUploadAtom,
    previewFileAtom,
    searchFileAtom,
    selectedFilesAtom,
    showInteractionBarAtom,
} from "../../store"

import FileComponent from "./FileComponent"
import FilePreview from "./FilePreview"

import { useOfflineSearch } from "../../hooks"

const Container = styled(motion.div)`
    position: relative;

    flex: 1;

    padding: 16px;
    outline: none;

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px,1fr));
    grid-template-rows: 1fr;
    grid-gap: 16px;

    /* justify-content: center; */

    overflow-y: auto;
`

const Hint = styled.label`
    position: absolute;
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    text-align: center;
`

const UploadInput = styled.input`
    display: none;
`

type props = {
    files: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>[]
    getRootProps?: (props?: DropzoneRootProps) => DropzoneRootProps
}

export default function FileGrid({ files, getRootProps }: props) {
    const [selectedFiles, setSelectedFiles] = useAtom(selectedFilesAtom)
    const [showInteractionBar] = useAtom(showInteractionBarAtom)
    const [, setPreviewFile] = useAtom(previewFileAtom)

    const [searchText] = useAtom(searchFileAtom)

    const searchResult = useOfflineSearch({
        searchDocuments: files,
        keys: ["name", "tags", "mlLabels"],
        searchText
    })

    const fileList = useMemo(() => (searchResult.length ? searchResult : files).map(
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
                onDelete={() => deleteFiles([fileDocSnap])}
                key={fileDocSnap.id} />
    ), [searchResult, selectedFiles, showInteractionBar])

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

    const [, setFilesToUpload] = useAtom(filesToUploadAtom)

    // @ts-ignore
    return <Container
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={variants}
        {...(getRootProps ? getRootProps({}) : {})}>
        {fileList.length ?
            fileList
            :
            <Hint>
                Drag and drop or <br />
                click to upload files
            <UploadInput
                    multiple
                    onChange={event => {
                        if (event.target.files) {
                            setFilesToUpload(Array.from(event.target.files))
                        }
                        event.target.value = ""
                    }}
                    type={"file"} />
            </Hint>}
        {previewFile && <FilePreview files={files} />}
    </Container>
}
