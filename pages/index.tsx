import Link from "next/link"
import styled from "styled-components"
import Clients from "../components/clients"
import { useUser } from "../context/userContext"

const Container = styled.div`
`

export default function Home() {
  const { user, logout } = { ...useUser() }

  return <Container>
    {user ? <>
      <Link href={"/login"}>
        <a onClick={logout}>logout</a>
      </Link>
      <Clients />
    </> :
      <Link href={"/login"}>
        <a>login</a>
      </Link>}
  </Container >
}
