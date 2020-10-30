import firebase from "../../firebase/clientApp"

import { useMemo } from "react"
import styled from "styled-components"

import FileComponent from "./FileComponent"

import { DropzoneRootProps } from "react-dropzone"

const Container = styled.div`
    text-align: center;
    outline: none;
    position: relative;
    grid-area: files;

    padding: 16px;

    display: grid;
    grid-template-columns: repeat(auto-fit, 300px);
    grid-template-rows: repeat(auto-fit, 300px);
    gap: 16px;
    justify-items: start;
    align-items: start;
    height: 100%;
`

type props = {
    files: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>[]
    getRootProps?: (props?: DropzoneRootProps) => DropzoneRootProps
}

export default function FileGrid({ files, getRootProps }: props) {
    const fileList = useMemo(() => files.map(
        fileSnapshot =>
            <FileComponent
                key={fileSnapshot.id}
                onDelete={() => {
                    fileSnapshot.ref.delete().then(() => {
                        const storage = firebase.storage()
                        const fileRef = storage.ref(fileSnapshot.get("fullPath"))
                        fileRef.delete()

                        firebase.analytics().logEvent("delete_file", {
                            name: fileSnapshot.get("name"),
                            fullPath: fileSnapshot.get("fullPath")
                        })
                    })
                }}
                fullPath={fileSnapshot.get("fullPath")} />
    ), [files])

    return <Container {...(getRootProps ? getRootProps({}) : {})}>
        {fileList}
    </Container>
}
