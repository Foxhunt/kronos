import { useAtom } from "jotai"
import { useRef } from "react"
import styled from "styled-components"

import { useClickedOutside, useClients, useScollIntoView, useTags } from "../../hooks"
import {
    filterOrderByAtom,
    filterTagsAtom,
    filterClientsAtom,
    orderOptions,
    filterFavoriteAtom,
    filterMarkedAtom
} from "../../store"

import FilterList, { Container as CustomListContainer, Item, Items } from "./FilterList"

const Container = styled.div`
    width: 100%;
    max-height: calc(6 * 31px);

    display: grid;
    grid-template-columns: repeat(3,1fr);
    grid-template-rows: calc(6 * 31px);
    
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

    // const tags = useTags()
    // const [tag, setTag] = useAtom(filterTagsAtom)

    return <Container
        ref={containerRef}>
        <CustomListContainer>
            <Item>sort By</Item>
            <Items>
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
            </Items>
        </CustomListContainer>
        <CustomListContainer>
            <Item>Marked / Favorite</Item>
            <Items>
                <Item
                    selected={favorites}
                    onClick={() => {
                        setFavorties(!favorites)
                    }}>
                    favorites
                </Item>
                <Item
                    selected={marked}
                    onClick={() => {
                        setMarked(!marked)
                    }}>
                    marked
                </Item>
            </Items>
        </CustomListContainer>
        {/* <FilterList
            name={"Tag"}
            items={tags}
            selected={tag}
            onSelect={item => setTag(item)} /> */}
    </Container>
}