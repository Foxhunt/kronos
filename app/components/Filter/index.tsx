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
`

const TextSearch = styled.input`
    width: calc(100% - 5px);
    height: 29px;
    padding: unset;

    padding-left: 5px;

    border: none;
    border-bottom: black 2px solid;
    box-shadow: none;

    font-family: "FuturaNowHeadline-Bd";

    &::placeholder {
        color: #dfdfe4;
        text-transform: uppercase;
    }

    &:focus {
        outline: none!important;
    }
`

const Selectibles = styled.div`
    width: 100%;

    display: grid;
    grid-template-columns: repeat(3,1fr);
    grid-template-rows: calc(5 * 31px - 1px);

    border-bottom: 1px solid black;

    overflow: hidden;
`

export const sortByOptions: orderOptions[] = [
    {
        displayName: "CREATED LATEST",
        orderBy: "createdAt",
        orderDirection: "desc"
    }, {
        displayName: "CREATED LAST",
        orderBy: "createdAt",
        orderDirection: "asc"
    }, {
        displayName: "NAME Z TO A",
        orderBy: "name",
        orderDirection: "desc"
    }, {
        displayName: "NAME A TO Z",
        orderBy: "name",
        orderDirection: "asc"
    }, {
        displayName: "RANDOM",
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
        <TextSearch
            type="text"
            placeholder={"Type to Search"}
            value={searchedFile}
            onChange={event => {
                setSearchedFile(event.target.value)
            }} />
        <Selectibles>
            <FilterList
                lenght={4}
                name={"SORT BY"}>
                {sortByOptions?.map(item =>
                    <Item
                        ref={orderBy === item ? selectedSortByItemRef : null}
                        key={item.orderBy + item.orderDirection}
                        selected={false}
                        onClick={() => {
                            if (orderBy === item) {
                                setOrderBy(sortByOptions[0])
                            } else {
                                setOrderBy(item)
                            }
                        }}>
                        <Circle
                            fill={orderBy === item ? "#000000" : "#ffffff"}
                            stroke="#000000" />
                        {item.displayName}
                    </Item>
                )}
            </FilterList >
            <FilterList
                lenght={4}
                name={"MARKED AS"}>
                <Item
                    selected={false}
                    onClick={() => {
                        setFavorties(!favorites)
                    }}>
                    <Circle
                        fill={favorites ? "#0501ff" : "#00000000"}
                        stroke="#0501ff" />
                FAVORITES
                </Item>
                <Item
                    selected={false}
                    onClick={() => {
                        setMarked(!marked)
                    }}>
                    <Circle
                        fill={marked ? "#33bd27" : "#00000000"}
                        stroke="#33bd27" />
                MARKED
            </Item>
            </FilterList>
            <FilterList
                lenght={4}
                name={"TAGS"}>
                {tags.map(tag => <Item
                    key={tag.id}
                    selected={false}
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
                    <Circle
                        fill={selectedTags.includes(tag.id) ? "#000000" : "#ffffff"}
                        stroke="#000000" />
                    {tag.id}
                </Item>)}
            </FilterList>
        </Selectibles>
    </Container >
}