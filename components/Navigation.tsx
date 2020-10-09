import styled from "styled-components"

const Container = styled.div`
    background-color: white;
`

const LocationCollections = styled.div`
    display: grid;
    grid-template-columns: [location] 300px [collections] auto;
    grid-template-rows: 25px;
`

const Location = styled.div`
    background-color: black;
`

const Collections = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, 150px [collection]);
    grid-template-rows: 25px;
`

const Folders = styled.div`
    display: grid;
    grid-template-columns: [clients] 300px [projects] 300px [tasks] 300px [designs] auto;
    grid-template-rows: repeat(20, 25px);
`

export default function Navigation() {
    return <Container>
        <LocationCollections>
            <Location />
            <Collections />
        </LocationCollections>
        <Folders>

        </Folders>
    </Container>
}