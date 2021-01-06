import firebase from "../firebase/clientApp"
import Fuse from "fuse.js"
import { useMemo } from "react"

type props = {
    searchDocuments: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>[]
    keys: string[]
    searchText: string
}

export function useOfflineSearch({ searchDocuments, keys, searchText }: props) {
    const searchItems = useMemo(() => searchDocuments.map(document => {
        const item: any = {
            id: document.id
        }

        for (const key of keys) {
            item[key] = document.get(key)
        }

        return item
    }), [searchDocuments])

    const index = useMemo(() => {
        const index = new Fuse(searchItems, {
            keys,
            threshold: 0.3
        })

        return index
    }, [searchItems])

    const searchResult = useMemo(() => {
        return index.search(searchText)
    }, [searchText, index])

    const foundIDs = useMemo(() => {
        return searchResult.map(result => result.item.id)
    }, [searchResult])

    return searchDocuments.filter(file => foundIDs.includes(file.id))
}
