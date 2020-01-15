import styled from 'styled-components';

interface TooltipContentProps {
  interactive: boolean;
  arrow: boolean;
  placement: string;
}

interface TransformPlacement {
  [key: string]: string;
}

export const TooltipContent = styled.div<TooltipContentProps>`
  position: relative;
  background-color: #000;
  border-radius: 4px;
  color: #fff;
  font-family: "Roboto", sans-serif;
  padding: ${(props): string => (props.interactive ? '8px 16px' : '4px 8px')};
  font-size: ${(props): string => (props.interactive ? '14px' : '12px')};
  max-width: 300px;
  word-wrap: break-word;

  transform-origin: ${(props): string => ({
    bottom: 'center top',
    top: 'center bottom',
    right: 'left center',
    left: 'right center',
  } as TransformPlacement)[props.placement]};

  margin: ${(props): string => ({
    bottom: props.arrow ? '6px 0' : '4px 0',
    top: props.arrow ? '6px 0' : '4px 0',
    right: props.arrow ? '0 6px' : '0 4px',
    left: props.arrow ? '0 6px' : '0 4px',
  } as TransformPlacement)[props.placement]};
`;
