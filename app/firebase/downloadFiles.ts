import firebase from "./clientApp"

import JSZip from "jszip"
import { saveAs } from "file-saver"

export default async function downloadFiles(files: firebase.firestore.DocumentSnapshot[]) {
    const zip = new JSZip()

    const downloads = files.map(async fileDocSnap => {
        const fileName = fileDocSnap.get("name")
        const url = fileDocSnap.get("downloadURL")
        const response = await fetch(url)
        const file = await response.blob()
        zip.file(fileName, file)
    })

    await Promise.all(downloads)

    const zipBlob = await zip.generateAsync({ type: "blob" })
    saveAs(zipBlob, "download.zip")
}
