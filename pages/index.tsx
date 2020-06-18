import styled from "styled-components"
import Conent from "../components/content"

const Container = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 20% auto 20%;
`

const Project = styled.div`
  background-color: blue;
  text-align: center;
`
const Context = styled.div`
  background-color: yellow;
  text-align: center;
`

export default function Home() {
  return <Container>
    <Project>Project</Project>
    <Conent />
    <Context>Context</Context>
  </Container >
}
