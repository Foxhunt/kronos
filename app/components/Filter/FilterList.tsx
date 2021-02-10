import { ComponentProps } from "react"
import styled from "styled-components"

import { ItemList, Item } from "../Shared/ItemList"

export const Container = styled.div`
    min-width: 0px;
`

interface props extends ComponentProps<"div"> {
    name: string
    lenght?: number
}

export default function FilterList({ name, children, lenght = 4 }: props) {
    return <Container>
        <Item>{name}</Item>
        <ItemList
            lenght={lenght}>
            {children}
        </ItemList>
    </Container>
}
