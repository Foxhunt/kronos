import firebase from "./clientApp"

export default async function markFiles(files: firebase.firestore.DocumentSnapshot[]) {
    const freshFiles = await Promise.all(files.map(file => file.ref.get()))

    const marked = freshFiles.every(file => file.get("marked"))

    const batch = firebase.firestore().batch()

    for (const file of files) {
        batch.update(file.ref, {
            marked: !marked
        })

        firebase.analytics().logEvent("marked_file", {
            name: file.get("name"),
            fullPath: file.get("fullPath")
        })

    }

    batch.commit()
}
