import { useAtom } from "jotai"
import React from "react"
import styled from "styled-components"
import { selectedCollectionDocRefAtom, userDocRefAtom } from "../../store"

import Boards from "./Boards"

const Container = styled.div`
    height: 30px;
    display: grid;
    grid-template-columns: 1fr 200px;
    
    border-bottom: 1px solid black;
`

const Upload = styled.label`
    background-color: black;
    color: white;

    display: flex;
    justify-content: center;
    align-items: center;
`

const UploadInput = styled.input`
    display: none;
`

type props = {
    onUpload: (acceptedFiles: File[]) => void
}

export default function BoardBar({ onUpload }: props) {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [selectedCollection] = useAtom(selectedCollectionDocRefAtom)
    return <Container>
        <Boards />
        <Upload>
            {selectedCollection ?
                <>
                    Upload
                    <UploadInput
                        multiple
                        type={"file"}
                        onChange={event => {
                            if (event.target.files) {
                                onUpload(Array.from(event.target.files))
                            }
                            event.target.value = ""
                        }} />
                </>
                :
                <>Select a {userDocRef?.get("boards")} to upload files</>}
        </Upload>

    </Container >
}
