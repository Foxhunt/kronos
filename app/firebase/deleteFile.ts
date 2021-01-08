import firebase from "./clientApp"

export default function deleteFile(fileDocSnap: firebase.firestore.DocumentSnapshot) {
    firebase.storage().refFromURL(fileDocSnap.get("downloadURL")).delete()

    const renderedPDFs = fileDocSnap.get("renderedPDF")

    for (const size in renderedPDFs) {
        firebase.storage().refFromURL(renderedPDFs[size]).delete()
    }

    fileDocSnap.ref.delete()

    firebase.analytics().logEvent("delete_file", {
        name: fileDocSnap.get("name"),
        fullPath: fileDocSnap.get("fullPath")
    })
}
