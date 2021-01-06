import Fuse from "fuse.js"
import { useMemo } from "react"

type props<T> = {
    searchItems: T[]
    keys: string[]
    searchText: string
}

// make searchItems firestore.DocumentSnapshots and transform based on keys???

export function useOfflineSearch<T>({ searchItems: searchitems, keys, searchText }: props<T>) {
    const index = useMemo(() => {
        const index = new Fuse(searchitems, {
            keys,
            threshold: 0.3
        })

        return index
    }, [searchitems])

    const searchResult = useMemo(() => {
        return index.search(searchText)
    }, [searchText, index])

    return searchResult
}
