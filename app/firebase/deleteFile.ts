import firebase from "./clientApp"

export default async function deleteFile(fileDocSnap: firebase.firestore.DocumentSnapshot) {
    fileDocSnap.ref.delete().then(() => {
        const storage = firebase.storage()
        const fileRef = storage.ref(fileDocSnap.get("fullPath"))
        fileRef.delete()

        firebase.analytics().logEvent("delete_file", {
            name: fileDocSnap.get("name"),
            fullPath: fileDocSnap.get("fullPath")
        })
    })
}
