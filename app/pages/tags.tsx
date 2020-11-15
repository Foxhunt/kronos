import firebase from "../firebase/clientApp"
import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { userDocRefAtom } from "../store"

import FileGrid from "../components/TasksAndFiles/FileGrid"

export default function favorites() {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [selectedTag, setSelectedTag] = useState<firebase.firestore.DocumentSnapshot>()

    const [tags, setTags] = useState<firebase.firestore.DocumentSnapshot[]>([])
    useEffect(() => {
        const cleanup = userDocRef
            ?.collection("tags")
            .onSnapshot(snapshot => {
                setTags(snapshot.docs)
            })
        return cleanup
    }, [userDocRef])

    const [files, setFiles] = useState<firebase.firestore.DocumentSnapshot[]>([])
    useEffect(() => {
        if (selectedTag) {
            const cleanup = userDocRef
                ?.collection("files")
                .where("tags", "array-contains", selectedTag.get("name"))
                .onSnapshot(snapshot => {
                    setFiles(snapshot.docs)
                })
            return cleanup
        }
        const cleanup = userDocRef
            ?.collection("files")
            .onSnapshot(snapshot => {
                setFiles(snapshot.docs)
            })
        return cleanup
    }, [selectedTag])

    return <>{
        tags.map(tag => <div
            key={tag.id}
            onClick={() => {
                selectedTag === tag ?
                    setSelectedTag(undefined)
                    :
                    setSelectedTag(tag)
            }}>
            {tag.get("name")}
        </div>)}
        <FileGrid
            files={files} />
    </>
}
