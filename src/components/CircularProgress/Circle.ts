/* eslint-disable @typescript-eslint/explicit-function-return-type */
import styled, { keyframes, css } from 'styled-components';

interface Props {
  indeterminate: boolean;
  stable: boolean;
  disableShrink: boolean;
}

const circularDash = keyframes`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0px;
  }
  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }
  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`;

export const Circle = styled.circle<Props>`
  stroke: currentColor;

  ${({ indeterminate }) => indeterminate && css`
    animation: ${circularDash} 1.4s ease-in-out infinite;
    stroke-dasharray: 80px, 200px;
    stroke-dashoffset: 0px;
  `}

  ${({ stable }) => stable && 'transition: stroke-dashoffset 300ms cubic-bezier(0.4, 0, 0.2, 1);'}
  ${({ disableShrink }) => disableShrink && 'animation: none;'}
`;
