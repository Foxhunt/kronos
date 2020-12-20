import firebase from "./clientApp"

export default async function deleteFile(fileDocSnap: firebase.firestore.DocumentSnapshot) {
    await fileDocSnap.ref.delete()
    await firebase.storage().ref(fileDocSnap.get("fullPath")).delete()

    const renderedPDFs = fileDocSnap.get("renderedPDF")

    for (const size in renderedPDFs) {
        await firebase.storage().ref(renderedPDFs[size]).delete()
    }

    firebase.analytics().logEvent("delete_file", {
        name: fileDocSnap.get("name"),
        fullPath: fileDocSnap.get("fullPath")
    })
}
