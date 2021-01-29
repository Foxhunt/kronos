import { Children, ComponentProps, useEffect, useRef, useState } from "react"
import styled from "styled-components"

import IconUpSVG from "../../assets/svg/Icons/ICON_UP.svg"
import IconDownSVG from "../../assets/svg/Icons/ICON_DOWN.svg"

export const Item = styled.div<{ selected?: boolean }>`
    display: flex;
    align-items: center;

    height: 30px;

    padding-left: 5px;
    border-bottom: black 1px solid;

    ${({ selected }) => selected ?
        `
        background-color: black;
        color: white;
        ` : ""
    }

    &:last-child {
        border-bottom: white 1px solid;
    }
`

const Items = styled.div<{ lenght: number }>`
    max-height: calc(${({ lenght }) => lenght} * 31px);
    overflow: auto;

    &::-webkit-scrollbar {
        display: none;
    }
`

const ScrollUpIndicator = styled.div`
    position: sticky;

    width: 100%;
    text-align: center;
    top: 0px;

    pointer-events: none;
`

const ScrollDownIndicator = styled.div`
    position: sticky;

    width: 100%;
    text-align: center;
    bottom: 0px;

    pointer-events: none;
`

interface props extends ComponentProps<"div"> {
    lenght: number
}

export function ItemList({ children, lenght }: props) {
    const [canScrollUp, setCanScrollUp] = useState(false)
    const [canScrollDown, setCanScrollDown] = useState(false)
    const ItemsRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (ItemsRef.current) {
            setCanScrollUp(ItemsRef.current.scrollTop >= 31)
            setCanScrollDown(ItemsRef.current.scrollHeight - ItemsRef.current.scrollTop - ItemsRef.current.clientHeight >= 31)
        }
    }, [ItemsRef.current, children])

    return <Items
        ref={ItemsRef}
        lenght={lenght}
        onScroll={event => {
            setCanScrollUp(event.currentTarget.scrollTop >= 31)
            setCanScrollDown(event.currentTarget.scrollHeight - event.currentTarget.scrollTop - event.currentTarget.clientHeight >= 31)
        }}>
        {canScrollUp && <ScrollUpIndicator><IconUpSVG /></ScrollUpIndicator>}
        {children}
        {new Array(Children.toArray(children).length < lenght ? lenght - Children.toArray(children).length : 0)
            .fill("")
            .map((_item, index) => <Item key={index} />)}
        {canScrollDown && <ScrollDownIndicator><IconDownSVG /></ScrollDownIndicator>}
    </Items>
}
