import { useEffect, useState } from "react"
import styled from "styled-components"

import firebase from "../firebase/clientApp"

const Container = styled.div.attrs<{ background?: string }>
    (({ background }) => ({
        style: {
            backgroundImage: `url(${background})`
        }
    })) <{ background?: string }>`
    background-color: black;

    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    width: 200px;
    height: 200px;

    color: white;

    > * {
        width: 100%;
        height: calc(100% - 18px);
    }
`

type FileProps = { fullPath: string, onDelete: () => void }

export default function File({ fullPath, onDelete }: FileProps) {

    const [src, setSrc] = useState<string>("")
    useEffect(() => {
        const storage = firebase.storage()
        const fileRef = storage.ref(fullPath)
        fileRef.getDownloadURL().then(src => setSrc(src))
    }, [fullPath])

    return <>
        <Container
            onClick={onDelete}
            background={src}>
            {name}
        </Container>
    </>
}
