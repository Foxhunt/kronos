import firebase from "./clientApp"

export default function markFile(file: firebase.firestore.DocumentSnapshot) {
    file.ref.update({
        marked: true
    })
    firebase.analytics().logEvent("mark_file", {
        name: file.get("name"),
        fullPath: file.get("fullPath")
    })
}
