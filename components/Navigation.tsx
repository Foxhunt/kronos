import { useState } from "react"
import styled from "styled-components"

const Container = styled.div`
    position: relative;
    z-index: 1;
    background-color: white;
    height: 25px;
`

const LocationCollections = styled.div`
    display: grid;
    grid-template-columns: [location] 300px [collections] auto;
    grid-template-rows: 25px;
`

const Location = styled.div<{ inverted: boolean }>`
    background-color: ${({ inverted }) => (inverted ? "black" : "white")};
    color:  ${({ inverted }) => (inverted ? "white" : "black")};
`

const Collections = styled.div`
    overflow: auto;
    white-space: nowrap;
`

const Collection = styled.div`
    display: inline-block;
    width: 150px;
    height: 100%;
`

const Folders = styled.div`
display: grid;
grid-template-columns: [clients] 300px[projects] 300px[tasks] 300px[designs] auto;
`

const Folder = styled.div`
background-color: white;
`

const Subfolder = styled.div`
height: 25px;
border-top: black 1px solid;

    :hover {
    background-color: black;
}
`

export default function Navigation() {
    const [showFolders, setShowFolders] = useState(false)

    return <Container>
        <LocationCollections>
            <Location
                inverted={showFolders}
                onClick={() => setShowFolders(!showFolders)}>
                Location
            </Location>
            <Collections>
                <Collection />
                <Collection />
                <Collection />
            </Collections>
        </LocationCollections>
        {showFolders && <Folders>
            <Folder>
                <div>Clients</div>
                <Subfolder />
                <Subfolder />
                <Subfolder />
                <Subfolder />
            </Folder>
            <Folder>
                <div>Projects</div>
                <Subfolder />
                <Subfolder />
                <Subfolder />
                <Subfolder />
            </Folder>
            <Folder>
                <div>Tasks</div>
                <Subfolder />
                <Subfolder />
                <Subfolder />
                <Subfolder />
            </Folder>
            <Folder>
                <div>Designs</div>
                <Subfolder />
                <Subfolder />
                <Subfolder />
                <Subfolder />
            </Folder>
        </Folders>}
    </Container>
}