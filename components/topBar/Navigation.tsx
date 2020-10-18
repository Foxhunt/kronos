import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import styled from "styled-components"
import {
    userDocRefAtom,
    clientsColRefAtom,
    projectsColRefAtom,
    tasksColRefAtom,
    collectionsColRefAtom,
    filesColRefAtom,
} from "../../store"

import Folder from "./Folder"
import Collections from "./Collections"

const Container = styled.nav`
    position: relative;
    z-index: 1;
    background-color: white;
    /* height: 25px; */
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

const Folders = styled.div`
    display: grid;
    grid-template-columns: [clients] 300px [projects] 300px[tasks] auto;
`

export default function Navigation() {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [showFolders, setShowFolders] = useState(false)

    const [clients, setClients] = useAtom(clientsColRefAtom)
    const [projects, setProjects] = useAtom(projectsColRefAtom)
    const [tasks, setTasks] = useAtom(tasksColRefAtom)
    const [collections, setCollections] = useAtom(collectionsColRefAtom)
    const [files, setFiles] = useAtom(filesColRefAtom)

    useEffect(() => {
        setClients(userDocRef?.collection("clients"))
    }, [userDocRef])

    return <Container>
        <LocationCollections>
            <Location
                inverted={showFolders}
                onClick={() => setShowFolders(!showFolders)}>
                Location
            </Location>
            <Collections
                selectedId={files?.parent?.id}
                collection={collections}
                onSelectCollection={collection => {
                    if (collection?.collection("files").path !== files?.path) {
                        setFiles(collection?.collection("files"))
                    }
                }}
            />
        </LocationCollections>
        {showFolders && <Folders>
            <Folder
                name={"Clients"}
                selectedId={projects?.parent?.id}
                collection={clients}
                onSelectSubfolder={subfolder => {
                    if (subfolder?.collection("projects").path !== projects?.path) {
                        setProjects(subfolder?.collection("projects"))
                    }
                }} />
            <Folder
                name={"Projects"}
                selectedId={tasks?.parent?.id}
                collection={projects}
                onSelectSubfolder={subfolder => {
                    if (subfolder?.collection("tasks").path !== tasks?.path) {
                        setTasks(subfolder?.collection("tasks"))
                    }
                }} />
            <Folder
                name={"Tasks"}
                selectedId={collections?.parent?.id}
                collection={tasks}
                onSelectSubfolder={subfolder => {
                    if (subfolder?.collection("collections").path !== collections?.path) {
                        setCollections(subfolder?.collection("collections"))
                    }
                }} />
        </Folders>}
    </Container>
}
