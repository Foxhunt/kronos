import Link from "next/link"
import styled from "styled-components"
import Content from "../components/content"
import Timeline from "../components/timeLine"
import { useUser } from "../context/userContext"

const Container = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 20% auto 20%;
  grid-template-rows: 20px auto;
  grid-template-areas: 
    "timeline timeline timeline"
    "content content content";
`

export default function Home() {
  const { user, loadingUser, logout } = useUser()

  console.log(user)

  return <Container>
    {user ? <>
      <Timeline />
      <Content />
    </> :
      <Link href={"/login"}>
        <a>login</a>
      </Link>}
  </Container >
}
