import { ComponentProps } from "react"
import styled from "styled-components"

import { ItemList, Item } from "../Shared/ItemList"

export const Container = styled.div`
`

interface props extends ComponentProps<"div"> {
    name: string
}

export default function FilterList({ name, children }: props) {
    return <Container>
        <Item>{name}</Item>
        <ItemList
            lenght={4}>
            {children}
        </ItemList>
    </Container>
}
