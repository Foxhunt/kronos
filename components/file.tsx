import { useEffect, useState } from "react"
import styled from "styled-components"

const Container = styled.div.attrs<{ background?: string }>
(({ background }) => ({
    style: {
        backgroundImage: `url(${background})`
    }
}))<{ background?: string }>`
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

type FileProps = { file: File, removeFile: (name: string) => void }
type FileContent = { src: string, type: string }

export default function File({ file, removeFile }: FileProps) {
    const [fileContent, setFileContent] = useState<FileContent>({ src: "", type: file.type })

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
            onClick={() => removeFile(file.name)}
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
