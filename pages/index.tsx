import styled from "styled-components"
import Collection from "../components/collection"
import { useUser } from "../context/userContext"

const Container = styled.div`
`

export default function Home() {
  const { user } = { ...useUser() }

  return <Container>
    {user ? <Collection /> : null}
  </Container >
}
