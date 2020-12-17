import firebase from "./clientApp"

export default function markFile(file: firebase.firestore.DocumentSnapshot) {
    file.ref.update({
        marked: true
    })
}
