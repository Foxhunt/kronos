import firebase from "firebase"
import { useEffect, useState } from "react"
import styled from "styled-components"

const Container = styled.div`
    background-color: white;
`

const Subfolder = styled.div<{ selected?: boolean }>`
    height: 25px;
    border-top: black 1px solid;

    ${({ selected }) => selected ?
        `
        background-color: black;
        color: white;
        ` : ""
    }

    :hover {
        background-color: black;
        color: white;
    }
`

type props = {
    name: string,
    selectedId: string | undefined,
    collection: firebase.firestore.CollectionReference | undefined,
    onSelectSubfolder: (docRef: firebase.firestore.DocumentReference | undefined) => void
}

export default function Folder({ name, selectedId, collection, onSelectSubfolder }: props) {

    const [subFolders, setSubfolders] = useState<firebase.firestore.DocumentSnapshot[]>([])

    useEffect(() => {
        const unsubscribe = collection?.onSnapshot(snapshot => setSubfolders(snapshot.docs))
        return () => {
            unsubscribe && unsubscribe()
            onSelectSubfolder(undefined)
            setSubfolders([])
        }
    }, [collection])

    return <Container>
        <div>{name}</div>
        <Subfolder
            key={"new"}>
            +++
        </Subfolder>
        {
            subFolders.map(subFolder =>
                <Subfolder
                    key={subFolder.id}
                    selected={selectedId === subFolder.id}
                    onClick={() => onSelectSubfolder(subFolder.ref)}>
                    {subFolder.get("name")}
                </Subfolder>)
        }
        {
            (new Array(25 - subFolders.length)).fill(0).map((_, index) =>
                <Subfolder
                    key={index} />)
        }
    </Container>
}