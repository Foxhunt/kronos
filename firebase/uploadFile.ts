import firebase from "./clientApp"

export default async function uploadFile(file: File) {
    const storageRef = firebase.storage().ref("images")
    const fileRef = storageRef.child(`${file.name}`)

    const uploadTask = fileRef.put(file)

    const docRef = await new Promise<firebase.firestore.DocumentReference>((resolve) => {
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            null,
            null,
            async () => {

                const db = firebase.firestore()
                const imageCollection = db.collection("images")

                resolve(await imageCollection.add({
                    name: fileRef.name,
                    fullPath: fileRef.fullPath
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
