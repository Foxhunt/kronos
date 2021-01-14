import React from "react"
import styled from "styled-components"

import { useAtom } from "jotai"
import { filesToUploadAtom } from "../../store"

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

export default function BoardBar() {
    const [, setFilesToUpload] = useAtom(filesToUploadAtom)
    return <Container>
        <Boards />
        <Upload>
            <>
                Upload
                    <UploadInput
                    multiple
                    type={"file"}
                    onChange={event => {
                        if (event.target.files) {
                            setFilesToUpload(Array.from(event.target.files))
                        }
                        event.target.value = ""
                    }} />
            </>
        </Upload>
    </Container >
}
