import firebase from "./clientApp"

export default function favoriteFile(file: firebase.firestore.DocumentSnapshot) {
    file.ref.update({
        favorite: true
    })
    firebase.analytics().logEvent("favorite_file", {
        name: file.get("name"),
        fullPath: file.get("fullPath")
    })
}
