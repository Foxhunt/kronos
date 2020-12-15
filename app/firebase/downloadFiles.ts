import firebase from "./clientApp"

import JSZip from "jszip"
import { saveAs } from "file-saver"

export default async function downloadFiles(files: firebase.firestore.DocumentSnapshot[]) {
    const zip = new JSZip()

    for (const fileDocSnap of files) {
        const storage = firebase.storage()
        const fileRef = storage.ref(fileDocSnap.get("fullPath"))
        const fileName = fileDocSnap.get("name")
        const url = await fileRef.getDownloadURL()
        const response = await fetch(url)
        const file = await response.blob()
        zip.file(fileName, file)
    }

    const zipBlob = await zip.generateAsync({ type: "blob" })
    saveAs(zipBlob, "download.zip")
}
