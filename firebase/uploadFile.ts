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

    return docRef.get()
}
