import { useAtom } from "jotai"
import styled from "styled-components"
import Collection from "../components/collection"
import { userDocAtom } from "../store"

const Container = styled.div`
`

export default function Home() {
  const [userDocRef] = useAtom(userDocAtom)

  return <Container>
    {userDocRef ? <Collection /> : null}
  </Container >
}
