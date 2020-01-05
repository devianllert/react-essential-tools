import styled from 'styled-components';

interface TooltipBoxProps {
  interactive?: boolean;
  arrow?: boolean;
  placement: string;
}

interface TransformPlacement {
  [key: string]: string;
}

const transformPlacement: TransformPlacement = {
  bottom: `
    transform-origin: center top;
    margin: 4px 0;
  `,
  top: `
    transform-origin: center bottom;
    margin: 4px 0;
  `,
  right: `
    transform-origin: left center;
    margin: 0 4px;
  `,
  left: `
    transform-origin: right center;
    margin: 0 4px;
  `,
};

export const TooltipBox = styled.div<TooltipBoxProps>`
  position: relative
  background-color: #000;
  border-radius: 4px;
  color: #fff;
  font-family: "Roboto", sans-serif;
  padding: ${(props): string => (props.interactive ? '8px 16px' : '4px 8px')};
  font-size: ${(props): string => (props.interactive ? '14px' : '12px')};
  max-width: 300px;
  word-wrap: break-word;

  ${(props): string => transformPlacement[props.placement]}
`;
