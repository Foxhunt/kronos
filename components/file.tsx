import { useEffect, useState } from "react"
import styled from "styled-components"

const Container = styled.div<{ background?: string }>`
    background-color: black;

    background-image: url(${({ background }) => background});
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

type FileProps = { file: File, onRemoveFile: () => void }

export default function File({ file, onRemoveFile }: FileProps) {
    const [fileContent, setFileContent] = useState({ src: "", type: file.type })

    const isPDF = file.type === "application/pdf"

    useEffect(() => {
        const reader = new FileReader()
        reader.addEventListener("load", event => {
            setFileContent({
                src: String(event.target?.result),
                type: file.type
            })
        })
        reader.readAsDataURL(file)
    }, [file])

    return <>
        <Container
            onClick={onRemoveFile}
            background={fileContent.src}>
            {file.name}
            {
                isPDF && <embed
                    src={fileContent.src}
                    type={fileContent.type} />
            }
        </Container>
    </>
}
