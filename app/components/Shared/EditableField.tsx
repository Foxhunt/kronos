import firebase from "../../firebase/clientApp"
import styled from "styled-components"
import { useRef, useState } from "react"
import { useClickedOutside } from "../../hooks"

const Value = styled.div`
    width: 100%;

    transition: background-color 300ms ease;

    &:hover{
        background-color: #e2e2e2;
    }
`

const Form = styled.form`
    width: 100%;
`

const Input = styled.input`
    width: 100%;
    padding: unset;

    background-color: #cecece;

    border: none;
    box-shadow: none;

    font-family: "FuturaNowHeadline-Bd";
    font-size: inherit;

    &::placeholder {
        color: #dfdfe4;
        line-height: 1;
        text-transform: uppercase;
    }

    &:focus {
        outline: none!important;
    }
`

interface props {
    document: firebase.firestore.DocumentSnapshot
    fieldName: string
}

export default function EditableField({ document, fieldName }: props) {
    const [isEditing, setIsEditing] = useState(false)
    const [fieldValue, setFieldValue] = useState(document.get(fieldName))

    const levelNameInputRef = useRef<HTMLInputElement>(null)
    useClickedOutside(levelNameInputRef, () => {
        document?.ref.update({ [fieldName]: fieldValue })
        setIsEditing(false)
    })

    return isEditing ?
        <Form
            onSubmit={event => {
                event.preventDefault()
                setIsEditing(false)
                document?.ref.update({ [fieldName]: fieldValue })
            }}>
            <Input
                autoFocus
                ref={levelNameInputRef}
                type={"text"}
                value={fieldValue}
                onChange={event => {
                    setFieldValue(event.target.value)
                }} />
        </Form>
        :
        <Value
            onDoubleClick={event => {
                event.preventDefault()
                setIsEditing(true)
            }}>
            {fieldValue}
        </Value>
}