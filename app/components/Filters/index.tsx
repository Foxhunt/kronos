import { useAtom } from "jotai"
import { useRef } from "react"
import styled from "styled-components"

import { useClickedOutside, useClients, useTags } from "../../hooks"
import {
    filterOrderByAtom,
    filterTagsAtom,
    filterClientsAtom
} from "../../store"

import FilterList from "./FilterList"

const Container = styled.div`
    width: 100%;
    max-height: calc(6 * 31px);

    display: grid;
    grid-template-columns: repeat(3,1fr);
    grid-template-rows: calc(6 * 31px);
    
    border-bottom: 1px solid black;
`

const sortByOptions = ["Upload", "Edit", "Marked", "Favorites"]

type props = {
    onHide: (event: MouseEvent) => void
}

export default function Filters({ onHide }: props) {

    const containerRef = useRef<HTMLDivElement>(null)
    useClickedOutside(containerRef, onHide)

    const [orderBy, setOrderBy] = useAtom(filterOrderByAtom)

    // const tags = useTags()
    // const [tag, setTag] = useAtom(filterTagsAtom)

    // const clients = useClients()
    // const [client, seClient] = useAtom(filterClientsAtom)

    return <Container
        ref={containerRef}>
        <FilterList
            name={"sort By"}
            items={sortByOptions}
            selected={orderBy}
            onSelect={item => setOrderBy(item)} />
        {/* <FilterList
            name={"Tag"}
            items={tags}
            selected={tag}
            onSelect={item => setTag(item)} />
        <FilterList
            name={"Client"}
            items={clients}
            selected={client}
            onSelect={item => seClient(item)} /> */}
    </Container>
}