/* eslint-disable @typescript-eslint/explicit-function-return-type */
import styled, { keyframes, css } from 'styled-components';

interface Props {
  indeterminate: boolean;
  stable: boolean;
  color: string;
}

const circularRotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

export const CircularContainer = styled.div<Props>`
  display: inline-block;

  color: ${({ color }) => color};

  ${({ indeterminate }) => indeterminate && css`animation: ${circularRotate} 1.4s linear infinite;`}

  ${({ stable }) => stable && 'transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);'}
`;
