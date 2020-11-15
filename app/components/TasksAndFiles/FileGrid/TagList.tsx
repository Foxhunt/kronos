import firebase from "../../../firebase/clientApp"
import { useState } from "react"
import styled from "styled-components"
import { motion, Variants } from "framer-motion"

const Container = styled(motion.div)`
    max-height: 100%;
    overflow: auto;
`

const Item = styled.div`
    display: flex;
    align-items: center;

    height: 30px;
    
    padding-left: 5px;
    border-bottom: black 1px solid;
`

const NewItemInput = styled.input`
    width: 100%;
    height: 30px;
    padding: unset;

    border: none;
    border-bottom: black 1px solid;
    box-shadow: none;

    &:focus {
        outline: none!important;
    }
`

type props = {
    items: firebase.firestore.DocumentReference[] | undefined
    onAdd: (itemName: string) => void
    onRemove: (item: firebase.firestore.DocumentReference) => void
}

export default function FolderList({ items, onAdd, onRemove }: props) {
    const [addingItem, setAddingItem] = useState(false)
    const [newItemName, setNewItemName] = useState("")

    const childVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    }

    return <Container
        variants={childVariants}
        onContextMenu={event => {
            event.stopPropagation()
        }}>
        <Item>{name}</Item>
        {addingItem ?
            <form
                onSubmit={event => {
                    event.preventDefault()
                    onAdd(newItemName)
                    setAddingItem(false)
                    setNewItemName("")
                }}>
                <NewItemInput
                    type={"text"}
                    autoFocus
                    value={newItemName}
                    onBlur={() => setAddingItem(false)}
                    onChange={event => {
                        setNewItemName(event.target.value)
                    }} />
            </form> : <Item
                onClick={() => setAddingItem(true)}>
                +++
        </Item>}
        {
            items?.map(item =>
                <Item
                    key={item}
                    onContextMenu={event => {
                        event.preventDefault()
                        onRemove(item)
                    }}>
                    {item}
                </Item>)
        }
    </Container>
}
