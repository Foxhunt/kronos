import firebase from "./clientApp"

export default async function uploadFile(file: File) {
    const storageRef = firebase.storage().ref("images")
    const fileRef = storageRef.child(`${file.name}`)

    await fileRef.put(file)

    const db = firebase.firestore()
    const imageCollection = db.collection("images")

    const docRef = await imageCollection.add({
        name: fileRef.name,
        fullPath: fileRef.fullPath
    })

    const fileDocRef = await docRef.get()

    firebase.analytics().logEvent("upload_file", {
        name: fileDocRef.get("name"),
        fullPath: fileDocRef.get("fullPath")
    })

    return fileDocRef
}
