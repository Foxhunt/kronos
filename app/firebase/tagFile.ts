import firebase from "./clientApp"

export default function tagFile(file: firebase.firestore.DocumentSnapshot, tag: firebase.firestore.DocumentSnapshot) {
    file.ref.update({
        tags: firebase.firestore.FieldValue.arrayUnion(tag.get("name"))
    })
}