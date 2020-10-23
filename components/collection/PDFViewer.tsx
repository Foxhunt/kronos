import { Document, Page, pdfjs } from "react-pdf"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

type props = {
    file: string
}

export default function PDFViewer({ file }: props) {
    return <Document file={file}>
        <Page
            renderAnnotationLayer={false}
            renderTextLayer={false}
            height={300}
            pageNumber={1} />
    </Document>
}
