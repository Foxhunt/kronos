import { useAtom } from "jotai"
import { useRef } from "react"
import styled from "styled-components"

import { useClickedOutside, useScollIntoView, useTags } from "../../hooks"
import {
    filterOrderByAtom,
    orderOptions,
    filterFavoriteAtom,
    filterMarkedAtom,
    filterTagsAtom,
    searchFileAtom
} from "../../store"

import FilterList from "./FilterList"
import { Item } from "../Shared/ItemList"

import Circle from "../Shared/Circle"

const Container = styled.div`
    width: 100%;

    display: grid;
    grid-template-columns: repeat(4,1fr);
    grid-template-rows: calc(6 * 31px - 1px);
    
    border-bottom: 1px solid black;
`

const sortByOptions: orderOptions[] = [
    {
        orderBy: "createdAt",
        orderDirection: "desc"
    }, {
        orderBy: "createdAt",
        orderDirection: "asc"
    }, {
        orderBy: "name",
        orderDirection: "desc"
    }, {
        orderBy: "name",
        orderDirection: "asc"
    }, {
        orderBy: "random",
        orderDirection: "asc"
    }
]

type props = {
    onHide: (event: MouseEvent) => void
}

export default function Filter({ onHide }: props) {
    const containerRef = useRef<HTMLDivElement>(null)
    useClickedOutside(containerRef, onHide)

    const [orderBy, setOrderBy] = useAtom(filterOrderByAtom)
    const selectedSortByItemRef = useRef<HTMLDivElement>(null)
    useScollIntoView(selectedSortByItemRef)

    const [favorites, setFavorties] = useAtom(filterFavoriteAtom)
    const [marked, setMarked] = useAtom(filterMarkedAtom)

    const tags = useTags()
    const [selectedTags, setSelectedTags] = useAtom(filterTagsAtom)

    const [searchedFile, setSearchedFile] = useAtom(searchFileAtom)

    return <Container
        ref={containerRef}>
        <input
            type="text"
            value={searchedFile}
            onChange={event => {
                setSearchedFile(event.target.value)
            }} />
        <FilterList
            name={"sort By"}>
            {sortByOptions?.map(item =>
                <Item
                    ref={orderBy === item ? selectedSortByItemRef : null}
                    key={item.orderBy + item.orderDirection}
                    selected={orderBy === item}
                    onClick={() => {
                        if (orderBy === item) {
                            setOrderBy({ orderBy: "createdAt", orderDirection: "desc" })
                        } else {
                            setOrderBy(item)
                        }
                    }}>
                    {item.orderBy}
                </Item>
            )}
        </FilterList >
        <FilterList
            name={"Marked / Favorite"}>
            <Item
                selected={favorites}
                onClick={() => {
                    setFavorties(!favorites)
                }}>
                <Circle
                    fill={favorites ? "#0501ff" : "none"}
                    stroke="#0501ff" />
                favorites
            </Item>
            <Item
                selected={marked}
                onClick={() => {
                    setMarked(!marked)
                }}>
                <Circle
                    fill={marked ? "#33bd27" : "none"}
                    stroke="#33bd27" />
                marked
            </Item>
        </FilterList>
        <FilterList
            name={"Tags"}>
            {tags.map(tag => <Item
                key={tag.id}
                selected={selectedTags.includes(tag.id)}
                onClick={() => {
                    if (selectedTags.includes(tag.id)) {
                        const newSelectedTags = [...selectedTags]
                        newSelectedTags.splice(selectedTags.indexOf(tag.id), 1)
                        setSelectedTags(newSelectedTags)
                    } else {
                        const newSelectedTags = [...selectedTags]
                        newSelectedTags.push(tag.id)
                        setSelectedTags(newSelectedTags)
                    }
                }}
                onContextMenu={event => {
                    event.preventDefault()
                    tag.ref.delete()
                    if (selectedTags.includes(tag.id)) {
                        const newSelectedTags = [...selectedTags]
                        newSelectedTags.splice(selectedTags.indexOf(tag.id), 1)
                        setSelectedTags(newSelectedTags)
                    }
                }}>
                {tag.id}
            </Item>)}
        </FilterList>
    </Container >
}