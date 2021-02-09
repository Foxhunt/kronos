import firebase from "../../firebase/clientApp"
import { useRef } from "react"
import styled from "styled-components"
import { Document, Page, pdfjs } from "react-pdf"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const Uploading = styled.div`
    text-transform: uppercase;
`

const PDF = styled.div`
    display: none;
`

type props = {
    fileDocSnap: firebase.firestore.DocumentSnapshot | undefined
    src: string
    height: number
}

export default function PDFViewer({ fileDocSnap, src, height }: props) {
    const pageDivRef = useRef<HTMLDivElement>(null)
    return <Container>
        <Uploading>Processing PDF ...</Uploading>
        <PDF>
            <Document file={src}>
                <Page
                    inputRef={pageDivRef}
                    width={height}
                    height={height}
                    pageNumber={1}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    onRenderSuccess={() => {
                        (pageDivRef.current?.firstChild as HTMLCanvasElement)?.toBlob(async fileBlob => {
                            if (!fileBlob) return

                            const file = new File([fileBlob], `${fileDocSnap?.get("name")}-${height}.png`, { type: fileBlob.type })

                            const storageRef = firebase.storage().ref(fileDocSnap?.get("collection").path)
                            const fileRef = storageRef.child(`${file.name}`)

                            const snapshot = await fileRef.put(file, {
                                cacheControl: "private, max-age=950400"
                            })

                            const downloadURL = await snapshot.ref.getDownloadURL()

                            fileDocSnap?.ref.update({
                                [`renderedPDF.${height}`]: downloadURL
                            })

                        }, "image/png", 1)
                    }} />
            </Document>
        </PDF>
    </Container>
}
