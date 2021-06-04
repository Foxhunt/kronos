import firebase from "./clientApp"

export default function deleteFiles(files: firebase.firestore.DocumentSnapshot[]) {
    const batch = firebase.firestore().batch()

    for (const file of files) {
        firebase.storage().ref(file.get("fullPath")).delete()

        const renderedPDFs = file.get("renderedPDF")

        for (const size in renderedPDFs) {
            firebase.storage().refFromURL(renderedPDFs[size]).delete()
        }

        batch.delete(file.ref)

        firebase.analytics().logEvent("delete_file", {
            name: file.get("name"),
            fullPath: file.get("fullPath")
        })
    }

    batch.commit()
}
