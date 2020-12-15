import firebase from "./clientApp"

export default async function favoriteFiles(files: firebase.firestore.DocumentSnapshot[]) {
    for (const file of files) {
        file.ref.update({
            favorite: true
        })
    }
}
