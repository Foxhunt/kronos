import firebase from "../../firebase/clientApp"
import styled from "styled-components"

const Container = styled.div`
    max-height: 100%;
    overflow: auto;
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

type props = {
    name: string
    selected: firebase.firestore.DocumentSnapshot | undefined
    items: firebase.firestore.DocumentSnapshot[] | undefined
    allowAdding: boolean
    onSelect: (docRef: firebase.firestore.DocumentSnapshot | undefined) => void
    onAdd: (itemName: string) => void
}

export default function FolderList({ selected, items, onSelect }: props) {
    return <Container>
        {
            items?.map(item =>
                <Item
                    key={item.id}
                    selected={selected?.id === item.id}
                    onContextMenu={event => {
                        event.preventDefault()
                        item.ref.delete()
                    }}
                    onClick={() => onSelect(item)}>
                    {item.get("name")}
                </Item>)
        }
    </Container>
}
