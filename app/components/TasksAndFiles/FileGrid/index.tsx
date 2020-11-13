import firebase from "../../../firebase/clientApp"

import { useMemo } from "react"
import styled from "styled-components"
import { AnimatePresence, motion, Variants } from "framer-motion"

import FileComponent from "./FileComponent"

import { DropzoneRootProps } from "react-dropzone"

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
`

type props = {
    files: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>[]
    getRootProps?: (props?: DropzoneRootProps) => DropzoneRootProps
}

export default function FileGrid({ files, getRootProps }: props) {
    const fileList = useMemo(() => files.map(
        fileDocSnap =>
            <FileComponent
                fileDocSnap={fileDocSnap}
                key={fileDocSnap.id}
                onDelete={() => {
                    fileDocSnap.ref.delete().then(() => {
                        const storage = firebase.storage()
                        const fileRef = storage.ref(fileDocSnap.get("fullPath"))
                        fileRef.delete()

                        firebase.analytics().logEvent("delete_file", {
                            name: fileDocSnap.get("name"),
                            fullPath: fileDocSnap.get("fullPath")
                        })
                    })
                }} />
    ), [files])

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
