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
    selectedTaskDocRefAtom,
    showFilterAtom,
    showFoldersAtom,
    showInteractionBarAtom,
} from "../../store"

import FileComponent from "./FileComponent"
import FilePreview from "./FilePreview"

import { useOfflineSearch } from "../../hooks"

const Container = styled(motion.div)`
    position: relative;

    outline: none;

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px,1fr));
    grid-template-rows: 1fr;
    grid-gap: 8px;
`

const Hint = styled.label<{ top: number }>`
    position: absolute;

    width: 100%;
    height: calc(100vh - ${({ top }) => top}px);

    display: flex;
    align-items: center;
    justify-content: center;

    text-align: center;
    line-height: 1.5;
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
    const [showFolders] = useAtom(showFoldersAtom)
    const [showFilter] = useAtom(showFilterAtom)

    const [task] = useAtom(selectedTaskDocRefAtom)

    const [, setPreviewFile] = useAtom(previewFileAtom)

    const [searchText] = useAtom(searchFileAtom)

    const searchResult = useOfflineSearch({
        searchDocuments: files,
        keys: ["name", "tags", "mlLabels"],
        searchText
    })

    let top = 30

    if (showFolders || showFilter) {
        top += 186
    }

    if (showInteractionBar) {
        top += 31
    }

    if (task) {
        top += 48
    }

    const fileList = useMemo(() => (searchResult.length ? searchResult : files).map(
        fileDocSnap =>
            <FileComponent
                top={top}
                fileDocSnap={fileDocSnap}
                selected={selectedFiles.some(selectedFile => selectedFile.id === fileDocSnap.id)}
                onSelect={() => {
                    if (showInteractionBar) {
                        if (!selectedFiles.some(selectedFile => selectedFile.id === fileDocSnap.id)) {
                            setSelectedFiles([...selectedFiles, fileDocSnap])
                        } else {
                            setSelectedFiles(selectedFiles.filter(selectedFile => selectedFile.id !== fileDocSnap.id))
                        }
                        firebase.analytics().logEvent("select_file", {
                            name: fileDocSnap.get("name"),
                            fullPath: fileDocSnap.get("fullPath")
                        })
                    } else {
                        setPreviewFile(fileDocSnap)
                        firebase.analytics().logEvent("preview_file", {
                            name: fileDocSnap.get("name"),
                            fullPath: fileDocSnap.get("fullPath")
                        })
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
            <Hint
                top={top}>
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
