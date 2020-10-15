import { useEffect, useState } from "react"
import styled from "styled-components"
import { useUser } from "../../context/userContext"

import Folder from "./Folder"

const Container = styled.nav`
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

export default function Navigation() {
    const { userDocRef } = { ...useUser() }
    const [showFolders, setShowFolders] = useState(false)

    const [clients, setClients] = useState<firebase.firestore.CollectionReference>()
    const [projects, setProjects] = useState<firebase.firestore.CollectionReference>()
    const [tasks, setTasks] = useState<firebase.firestore.CollectionReference>()
    const [designs, setDesigns] = useState<firebase.firestore.CollectionReference>()
    const [collections, setCollections] = useState<firebase.firestore.CollectionReference>()

    useEffect(() => {
        setClients(userDocRef?.collection("Clients"))
    }, [userDocRef])

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
            <Folder
                name={"Clients"}
                selectedId={projects?.parent?.id}
                collection={clients}
                onSelectSubfolder={subfolder => {
                    setProjects(subfolder?.collection("Projects"))
                }} />
            <Folder
                name={"Projects"}
                selectedId={tasks?.parent?.id}
                collection={projects}
                onSelectSubfolder={subfolder => {
                    setTasks(subfolder?.collection("Tasks"))
                }} />
            <Folder
                name={"Tasks"}
                selectedId={designs?.parent?.id}
                collection={tasks}
                onSelectSubfolder={subfolder => {
                    setDesigns(subfolder?.collection("Designs"))
                }} />
            <Folder
                name={"Designs"}
                selectedId={collections?.parent?.id}
                collection={designs}
                onSelectSubfolder={subfolder => {
                    setCollections(subfolder?.collection("Collections"))
                }} />
        </Folders>}
    </Container>
}
