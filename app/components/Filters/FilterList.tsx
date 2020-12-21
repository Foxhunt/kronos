import firebase from "../../firebase/clientApp"
import { useEffect, useRef } from "react"
import styled from "styled-components"

const Container = styled.div`
    background-color: white;
`

const Item = styled.div<{ selected?: boolean }>`
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
`

const Items = styled.div`
    max-height: calc(100% - 31px);
    overflow: auto;
`

type props = {
    name: string
    selected: string | firebase.firestore.DocumentSnapshot | undefined
    items: string[] | firebase.firestore.DocumentSnapshot[]
    onSelect: (item: string | undefined) => void
}

export default function FolderList({ name, selected, items, onSelect }: props) {
    const selectedItemRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (selectedItemRef.current) {
            selectedItemRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
        }
    }, [selectedItemRef.current])

    return <Container>
        <Item>{name}</Item>
        <Items>
            {items?.map(item =>
                <Item
                    ref={selected === item ? selectedItemRef : null}
                    key={item}
                    selected={selected === item}
                    onContextMenu={event => {
                        event.preventDefault()
                    }}
                    onClick={() => {
                        if (selected === item) {
                            onSelect(undefined)
                        } else {
                            onSelect(item)
                        }
                    }}>
                    {item}
                </Item>
            )}
        </Items>
    </Container>
}
