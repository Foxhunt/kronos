import firebase from "./clientApp"

export default function favoriteFile(file: firebase.firestore.DocumentSnapshot) {
    file.ref.update({
        favorite: true
    })
}
