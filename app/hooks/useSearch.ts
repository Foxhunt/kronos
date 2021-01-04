import { useEffect, useState } from "react"

import algoliasearch from "algoliasearch"
const algoliaClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY as string)

import { Hit } from "@algolia/client-search"

export function useSearch<T>(indexName: string, searchText: string) {
    const [searchResults, setSearchResults] = useState<Hit<T>[]>([])

    useEffect(() => {
        async function search() {
            const index = algoliaClient?.initIndex(indexName)
            const result = await index.search<T>(searchText, { cacheable: false })
            setSearchResults(result.hits)
        }
        if (searchText !== "") {
            search()
        } else {
            setSearchResults([])
        }
    }, [searchText])

    return searchResults
}