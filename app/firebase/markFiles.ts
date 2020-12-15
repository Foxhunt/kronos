import firebase from "./clientApp"

export default async function markFiles(files: firebase.firestore.DocumentSnapshot[]) {
    for (const file of files) {
        file.ref.update({
            marked: true
        })
    }
}
