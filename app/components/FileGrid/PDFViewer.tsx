import { Document, Page, pdfjs } from "react-pdf"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

type props = {
    file: string
    height: number
}

export default function PDFViewer({ file, height }: props) {
    return <Document file={file}>
        <Page
            renderAnnotationLayer={false}
            renderTextLayer={false}
            height={height}
            pageNumber={1} />
    </Document>
}
