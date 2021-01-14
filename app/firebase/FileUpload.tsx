import { useEffect } from "react"
import pLimit from "p-limit"

import { useAtom } from "jotai"
import {
    filterFavoriteAtom,
    filterMarkedAtom,
    filterOrderByAtom,
    filterTagsAtom,
    selectedClientDocRefAtom,
    selectedCollectionDocRefAtom,
    selectedProjectDocRefAtom,
    selectedTaskDocRefAtom,
    showFoldersAtom,
    userDocRefAtom,
    filesToUploadAtom
} from "../store"

import { useFiles } from "../hooks/useFiles"

import uploadFile from "../firebase/uploadFile"
import { useRouter } from "next/router"

export default function FileUpload() {
    const router = useRouter()
    const [userDocRef] = useAtom(userDocRefAtom)
    const [client] = useAtom(selectedClientDocRefAtom)
    const [project] = useAtom(selectedProjectDocRefAtom)
    const [task] = useAtom(selectedTaskDocRefAtom)
    const [collection] = useAtom(selectedCollectionDocRefAtom)

    const [orderOptions] = useAtom(filterOrderByAtom)
    const [favorite] = useAtom(filterFavoriteAtom)
    const [marked] = useAtom(filterMarkedAtom)
    const [tags] = useAtom(filterTagsAtom)

    const files = useFiles(client, project, task, collection, Infinity, orderOptions, favorite, marked, tags)

    const [, setShowFolders] = useAtom(showFoldersAtom)
    const [filesToUpload, setFilesToUpload] = useAtom(filesToUploadAtom)

    useEffect(() => {
        const uploadFiles = async (acceptedFiles: File[]) => {
            const PDFDocument = (await import("pdf-lib")).PDFDocument

            const limit = pLimit(5)

            if (client && project && task && collection && userDocRef) {
                acceptedFiles
                    .filter(newFile => !files.some(existingFile => existingFile.get("name") === newFile.name))
                    .map(newFile => limit(async () => {
                        // we want to split PDFs into pages and upload them individualy
                        if (newFile.type === "application/pdf") {
                            const pdf = await PDFDocument.load(await newFile.arrayBuffer())
                            const pageIndicies = pdf.getPageIndices()

                            // map convert and upload tasks
                            pageIndicies.map(i => limit(async () => {

                                const newFilePageName = `${newFile.name.substring(0, newFile.name.lastIndexOf(".pdf"))}-${i}.pdf`

                                if (!files.some(existingFile => existingFile.get("name") === newFilePageName)) {
                                    const extractedPagePDF = await PDFDocument.create()
                                    const [page] = await extractedPagePDF.copyPages(pdf, [i])
                                    extractedPagePDF.addPage(page)
                                    const pdfFile = new File(
                                        [await extractedPagePDF.save()],
                                        newFilePageName,
                                        { type: "application/pdf" }
                                    )

                                    await uploadFile(pdfFile, client, project, task, collection, userDocRef)
                                }
                            }))
                        } else {
                            await uploadFile(newFile, client, project, task, collection, userDocRef)
                        }
                    }))
                setFilesToUpload([])
            } else {
                setShowFolders(true)
            }
            router.push("/archive")
        }

        if (filesToUpload.length > 0) {
            uploadFiles(filesToUpload)
        }
    }, [userDocRef, files, collection, filesToUpload])

    return null
}
