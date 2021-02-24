import firebase from "./clientApp"

export default async function favoriteFiles(files: firebase.firestore.DocumentSnapshot[]) {
    const freshFiles = await Promise.all(files.map(file => file.ref.get()))

    const favorite = freshFiles.every(file => file.get("favorite"))

    const batch = firebase.firestore().batch()

    for (const file of files) {
        batch.update(file.ref, {
            favorite: !favorite
        })

        firebase.analytics().logEvent("favorite_file", {
            name: file.get("name"),
            fullPath: file.get("fullPath")
        })

    }

    batch.commit()
}
