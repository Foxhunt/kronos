import firebase from "./clientApp"

export default async function uploadFile(
    file: File,
    owner: firebase.firestore.DocumentReference,
    collection: firebase.firestore.DocumentReference,
    board: firebase.firestore.DocumentReference
) {
    const storageRef = firebase.storage().ref(collection.path)
    const fileRef = storageRef.child(`${file.name}`)

    const uploadTask = fileRef.put(file, {
        cacheControl: "private, max-age=950400"
    })

    const docRef = await new Promise<firebase.firestore.DocumentReference>((resolve) => {
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            null,
            null,
            async () => {
                const fileCollection = board.collection("files")

                const array = new Uint32Array(1)
                window.crypto.getRandomValues(array)

                collection.update({
                    lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                })

                board.update({
                    lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                })

                resolve(await fileCollection.add({
                    name: fileRef.name,
                    favorite: false,
                    marked: false,
                    owner: owner,
                    collection: collection,
                    board: board,
                    fullPath: fileRef.fullPath,
                    downloadURL: await fileRef.getDownloadURL(),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    random: array[0]
                }))
            })
    })

    const fileDocRef = await docRef.get()

    firebase.analytics().logEvent("upload_file", {
        name: fileDocRef.get("name"),
        fullPath: fileDocRef.get("fullPath")
    })

    return fileDocRef
}
