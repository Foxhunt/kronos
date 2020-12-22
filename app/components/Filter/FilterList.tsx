import styled from "styled-components"

export const Container = styled.div`
    background-color: white;
`

export const Item = styled.div<{ selected?: boolean }>`
    display: flex;
    align-items: center;

    height: 30px;
    
    padding-left: 5px;
    border-bottom: black 1px solid;

    ${({ selected }) => selected ?
        `
        background-color: black;
        color: white;
        ` : ""
    }
`

export const Items = styled.div`
    max-height: calc(100% - 31px);
    overflow: auto;
`
