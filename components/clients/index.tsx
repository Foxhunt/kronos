import { useMemo, useState, useEffect } from "react"
import styled from "styled-components"

import firebase from "../../firebase/clientApp"

import { useUser } from "../../context/userContext"

import ClientComponent from "./client"

const Container = styled.div`
    text-align: center;
    outline: none;
    position: relative;
    grid-area: content;

    padding: 16px;

    display: grid;
    grid-template-columns: repeat(auto-fit, 300px);
    grid-template-rows: repeat(auto-fit, 300px);
    gap: 16px;
    justify-items: start;
    align-items: start;
    height: 100vh;
`

const AddClientBtn = styled.div`
    width: 20px;
    height: 20px;
    
    background-color: black;
`

export default function Clients() {
    const { userDoc } = { ...useUser() }
    const [clients, setClients] = useState<firebase.firestore.DocumentSnapshot[]>([])

    useEffect(() => {
        const clientCollection = userDoc?.ref.collection("clients")

        const unsubscribe = clientCollection?.onSnapshot(snapshot => {
            setClients(snapshot.docs)
        })

        return unsubscribe
    }, [])

    const clientList = useMemo(() => clients.map(
        clientSnapshot => {
            console.log(clientSnapshot.data())
            return <ClientComponent
                key={clientSnapshot.id}
                onDelete={() => {
                    clientSnapshot.ref.delete().then(() => {
                        firebase.analytics().logEvent("delete_client")
                    })
                }} />
        }
    ), [clients])

    return <Container>
        {clientList}
        <AddClientBtn
            onClick={async () => {
                const clientDoc = await firebase.firestore().collection("clients").add({
                    name: "someClient",
                    users: [userDoc?.ref]
                })
                userDoc?.ref.collection("clients").doc().set({
                    reference: clientDoc
                })
            }} />
    </Container>
}
