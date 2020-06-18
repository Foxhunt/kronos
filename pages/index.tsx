import styled from "styled-components"
import Conent from "../components/content"

const Container = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 20% auto 20%;
  grid-template-rows: 20px auto;
  grid-template-areas: 
    "timeline timeline timeline"
    "project content context";
`

const Timeline = styled.div`
  background-color: grey;
  text-align: center;
  grid-area: timeline;
`

const Project = styled.div`
  background-color: blue;
  text-align: center;
  grid-area: project;
`
const Context = styled.div`
  background-color: yellow;
  text-align: center;
  grid-area: context;
`

export default function Home() {
  return <Container>
    <Timeline>Timeline</Timeline>
    <Project>Project</Project>
    <Conent />
    <Context>Context</Context>
  </Container >
}
