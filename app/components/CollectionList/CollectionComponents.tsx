import styled from "styled-components";
import IconUpSVG from "../../assets/svg/Icons/UP.svg";
import IconDownSVG from "../../assets/svg/Icons/DOWN.svg";
import { DropzoneRootProps } from "react-dropzone";

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  outline: none;
`;
export const StyledIconUpSVG = styled(IconUpSVG)`
  padding-left: 5px;
`;
export const StyledIconDownSVG = styled(IconDownSVG)`
  padding-left: 5px;
`;
export const Hint = styled.label`
  width: 100%;
  height: calc(100vh - 61px);
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const Overflow = styled.div`
  height: calc(100vh - 41px - 60px);
  overflow-y: auto;
`;
export const UploadInput = styled.input`
  display: none;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 100px) 2fr 6fr repeat(2, 50px);
  grid-template-rows: 30px;

  border-bottom: 1px solid black;
`;
export const CreateCollectionForm = styled.form<DropzoneRootProps>`
  height: 30px;

  background-color: ${({ isDragActive }) => isDragActive ? "green" : "initial"};

  border-bottom: 1px solid black;
`;
export const CreateCollection = styled.button``;

export const Cell = styled.div`
  min-width: 0px;

  display: flex;
  justify-content: left;
  align-items: center;

  padding-left: 8px;

  & > div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: initial;
  }
`;
