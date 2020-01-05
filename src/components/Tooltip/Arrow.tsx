import styled from 'styled-components';

interface ArrowProps {
  placement: string;
}

interface ArrowPlacement {
  [key: string]: string;
}

const arrowPlacement: ArrowPlacement = {
  bottom: `
    top: 0;
    left: 0;
    margin-top: -4px;
    height: 8px;
    width: 4px;

    &::before {
      border-width: 0 4px 4px 4px;
      border-color: transparent transparent currentcolor transparent;
    }
  `,
  top: `
    bottom: 0;
    left: 0;
    margin-bottom: -4px;
    height: 8px;
    width: 4px;

    &::before {
      border-width: 4px 4px 0 4px;
      border-color: currentcolor transparent transparent transparent;
    }
  `,
  right: `
    left: 0;
    margin-left: -4px;
    height: 8px;
    width: 4px;

    &::before {
      border-width: 4px 4px 4px 0;
      border-color: transparent currentcolor transparent transparent;
    }
  `,
  left: `
    right: 0;
    margin-right: -4px;
    height: 8px;
    width: 4px;

    &::before {
      border-width: 4px 0 4px 4px;
      border-color: transparent transparent transparent currentcolor;
    }
  `,
};


export const Arrow = styled.span<ArrowProps>`
  position: absolute;
  font-size: 6px;
  color: #000;

  &::before {
    content: "";
    margin: auto;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
  }

  ${(props): string => arrowPlacement[props.placement]}
`;
