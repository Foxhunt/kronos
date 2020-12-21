import firebase from "./clientApp"

export default async function uploadFile(
    file: File,
    client: firebase.firestore.DocumentSnapshot,
    project: firebase.firestore.DocumentSnapshot,
    task: firebase.firestore.DocumentSnapshot,
    collection: firebase.firestore.DocumentSnapshot,
    userDocRef: firebase.firestore.DocumentReference
) {
    const storageRef = firebase.storage().ref(collection.ref.path)
    const fileRef = storageRef.child(`${file.name}`)

    const uploadTask = fileRef.put(file, {
        cacheControl: "private, max-age=950400"
    })

    const docRef = await new Promise<firebase.firestore.DocumentReference>((resolve) => {
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            null,
            null,
            async () => {
                const fileCollection = userDocRef.collection("files")

                resolve(await fileCollection.add({
                    name: fileRef.name,
                    favorite: false,
                    marked: false,
                    client: client.ref,
                    project: project.ref,
                    task: task.ref,
                    collection: collection.ref,
                    fullPath: fileRef.fullPath,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
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
