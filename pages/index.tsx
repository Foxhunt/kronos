import styled from "styled-components"
import Content from "../components/content"

const Container = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 20% auto 20%;
  grid-template-rows: 20px auto;
  grid-template-areas: 
    "timeline timeline timeline"
    "content content content";
`

const Timeline = styled.div`
  background-color: grey;
  text-align: center;
  grid-area: timeline;
`

export default function Home() {
  return <Container>
    <Timeline>Timeline</Timeline>
    <Content />
  </Container >
}
