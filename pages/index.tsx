import styled from "styled-components"
import Clients from "../components/clients"
import { useUser } from "../context/userContext"

const Container = styled.div`
`

export default function Home() {
  const { user } = { ...useUser() }

  return <Container>
    {user ? <Clients /> : null}
  </Container >
}
