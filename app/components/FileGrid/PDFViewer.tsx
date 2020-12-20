import firebase from "../../firebase/clientApp"
import { useRef } from "react"
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

type props = {
    fileDocSnap: firebase.firestore.DocumentSnapshot | undefined
    src: string
    height: number
}

export default function PDFViewer({ fileDocSnap, src, height }: props) {
    const pageDivRef = useRef<HTMLDivElement>(null)
    return <Document file={src}>
        <Page
            inputRef={pageDivRef}
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
                        cacheControl: "private, max-age=3600"
                    })

                    const fullPath = await snapshot.ref.fullPath
                    fileDocSnap?.ref.update({
                        [`renderedPDF.${height}`]: fullPath
                    })
                }, "image/png", 1)
            }} />
    </Document>
}
