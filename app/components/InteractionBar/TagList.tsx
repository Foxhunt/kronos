import firebase from "../../firebase/clientApp"
import { useEffect, useRef, useState } from "react"
import { useClickedOutside, useTags } from "../../hooks"

import algoliasearch from "algoliasearch"
const algoliaClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY as string)

import AlgoliaSVG from "../../assets/svg/algolia-blue-mark.svg"

import { Hit } from "@algolia/client-search"

import styled from "styled-components"

import { useAtom } from "jotai"
import { userDocRefAtom } from "../../store"

const Container = styled.div`
    position: absolute;
    z-index: 1;
    background-color: white;

    width: 170px;
`

const NewItemInput = styled.input`
    padding: unset;

    height: 25px;
    width: calc(100% - 25px);

    border: none;
    border-bottom: black 1px solid;
    box-shadow: none;

    &:focus {
        outline: none!important;
    }
`

const Tag = styled.div`

`

type Tag = { name: string }

type props = {
    onHide: (event: MouseEvent) => void
    onSelectTag: (tag: firebase.firestore.DocumentSnapshot) => void
}

export default function TagList({ onSelectTag, onHide }: props) {
    const [userDocRef] = useAtom(userDocRefAtom)

    const tags = useTags()

    const [searchResults, setSearchResults] = useState<Hit<Tag>[]>([])
    const [newItemName, setNewItemName] = useState("")

    useEffect(() => {
        async function searchTags() {
            const index = algoliaClient?.initIndex(`${userDocRef?.id}_tags`)
            const result = await index.search<Tag>(newItemName)
            setSearchResults(result.hits)
        }
        if (newItemName !== "") {
            searchTags()
        } else {
            setSearchResults([])
        }
    }, [newItemName])

    const containerRef = useRef<HTMLDivElement>(null)
    useClickedOutside(containerRef, onHide)

    return <Container
        ref={containerRef}>
        <form
            onSubmit={event => {
                event.preventDefault()
                const tagRef = userDocRef?.collection("tags").doc(newItemName)
                tagRef?.set({ name: newItemName })
                setNewItemName("")
            }}>
            <NewItemInput
                type={"text"}
                autoFocus
                value={newItemName}
                onChange={event => {
                    setNewItemName(event.target.value)
                }} />
            <AlgoliaSVG />
        </form>
        {
            searchResults.length === 0 &&
            newItemName !== "" &&
            <Tag
                onPointerDown={event => {
                    event.preventDefault()
                    const tagRef = userDocRef?.collection("tags").doc(newItemName)
                    tagRef?.set({ name: newItemName })
                    setNewItemName("")
                }}>
                not found click to create
            </Tag>
        }
        {
            searchResults.length ?
                searchResults.map(searchResult =>
                    <Tag
                        onPointerDown={async event => {
                            event.stopPropagation()
                            const tag = await userDocRef?.collection("tags").doc(searchResult.name).get()
                            tag && onSelectTag(tag)
                        }}
                        key={searchResult.objectID}>
                        {searchResult.name}
                    </Tag>
                )
                :
                newItemName === "" && tags.map(tag =>
                    <Tag
                        onPointerDown={event => {
                            event.stopPropagation()
                            onSelectTag(tag)
                        }}
                        key={tag.id}>
                        {tag.get("name")}
                    </Tag>
                )
        }
    </Container >
}
