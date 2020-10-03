import styled from "styled-components"

const Container = styled.div`
    position: relative;
    background-color: black;

    width: 100%;
    height: 100%;

    display: flex;

    justify-content: center;
`

const Name = styled.div`
    position: absolute;
    bottom: 0px;

    color: red;
`

type FileProps = { onDelete: () => void }

export default function ClientComponent({ onDelete }: FileProps) {

    return <>
        <Container
            onClick={onDelete}>
            <Name></Name>
        </Container>
    </>
}
