import firebase from "../firebase/clientApp"
import { useEffect, useState } from "react"
import Head from "next/head"
import { useAtom } from "jotai"
import { userDocRefAtom } from "../store"

import FileGrid from "../components/FileGrid"

export default function Catalogue() {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [selectedTag, setSelectedTag] = useState<firebase.firestore.DocumentSnapshot>()

    const [tags, setTags] = useState<firebase.firestore.DocumentSnapshot[]>([])
    useEffect(() => {
        const cleanup = userDocRef?.ref
            .collection("tags")
            .onSnapshot(snapshot => {
                setTags(snapshot.docs)
            })
        return cleanup
    }, [userDocRef])

    const [favorites, setFavorites] = useState(false)
    const [files, setFiles] = useState<firebase.firestore.DocumentSnapshot[]>([])
    useEffect(() => {
        const query = userDocRef?.ref
            .collection("files")
            .where("favorite", "in", [true, favorites])

        if (selectedTag) {
            const cleanup = query
                ?.where("tags", "array-contains", selectedTag.get("name"))
                .onSnapshot(snapshot => {
                    setFiles(snapshot.docs)
                })
            return cleanup
        }
        const cleanup = query
            ?.onSnapshot(snapshot => {
                setFiles(snapshot.docs)
            })
        return cleanup
    }, [selectedTag, favorites])

    return <>
        <Head>
            <title>Catalogue</title>
        </Head>
        <input
            type="checkbox"
            onChange={event => {
                setFavorites(event.target.checked)
            }} />
        {tags.map(tag => <div
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
