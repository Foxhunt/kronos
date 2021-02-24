import firebase from "./clientApp"

export default function tagFile(file: firebase.firestore.DocumentSnapshot, tag: firebase.firestore.DocumentSnapshot) {
    file.ref.update({
        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        tags: firebase.firestore.FieldValue.arrayUnion(tag.get("name"))
    })
    firebase.analytics().logEvent("tag_file", {
        name: file.get("name"),
        fullPath: file.get("fullPath"),
        tag: tag.get("name")
    })
}