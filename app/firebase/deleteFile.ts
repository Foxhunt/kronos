import firebase from "./clientApp"

export default async function deleteFile(fileDocSnap: firebase.firestore.DocumentSnapshot) {
    await fileDocSnap.ref.delete()
    await firebase.storage().ref(fileDocSnap.get("fullPath")).delete()

    firebase.analytics().logEvent("delete_file", {
        name: fileDocSnap.get("name"),
        fullPath: fileDocSnap.get("fullPath")
    })
}
