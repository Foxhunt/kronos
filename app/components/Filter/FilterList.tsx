import { ComponentProps, ReactNode, useEffect, useRef, useState } from "react"
import styled from "styled-components"

export const Container = styled.div`
    background-color: white;
`

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
        border-bottom: none;
    }
`

export const Items = styled.div`
    max-height: calc(100% - 31px);
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
`
const ScrollDownIndicator = styled.div`
    position: sticky;

    width: 100%;
    text-align: center;
    bottom: 0px;
`

interface props extends ComponentProps<"div"> {
    name: string
}

export default function FilterList({ name, children }: props) {
    const [canScrollUp, setCanScrollUp] = useState(false)
    const [canScrollDown, setCanScrollDown] = useState(false)
    const ItemsRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (ItemsRef.current) {
            setCanScrollUp(ItemsRef.current.scrollTop >= 31)
            setCanScrollDown(ItemsRef.current.scrollHeight - ItemsRef.current.scrollTop - ItemsRef.current.clientHeight >= 31)
        }
    }, [ItemsRef.current, children])

    return <Container>
        <Item>{name}</Item>
        <Items
            ref={ItemsRef}
            onScroll={event => {
                setCanScrollUp(event.currentTarget.scrollTop >= 31)
                setCanScrollDown(event.currentTarget.scrollHeight - event.currentTarget.scrollTop - event.currentTarget.clientHeight >= 31)
            }}>
            {canScrollUp && <ScrollUpIndicator>up</ScrollUpIndicator>}
            {children}
            {new Array((children as Array<ReactNode>)?.length < 5 ? 5 - (children as Array<ReactNode>)?.length : 0)
                .fill("")
                .map((_item, index) => <Item key={index} />)}
            {canScrollDown && <ScrollDownIndicator>down</ScrollDownIndicator>}
        </Items>
    </Container>
}
