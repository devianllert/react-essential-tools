import React from 'react';
import styled from 'styled-components';

import { Skeleton } from '../Skeleton';

const Card = styled.div`
  max-width: 345px;
  background-color: #fff;
  box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const CardContent = styled.div`
  padding: 16px;
`;


export default {
  title: 'Skeleton',
};

export const Basic = () => (
  <Card>
    <CardHeader>
      <Skeleton height={10} width="80%" style={{ marginBottom: 6 }} />
      <Skeleton height={10} width="40%" />
    </CardHeader>

    <Skeleton variant="rect" height={140} />

    <CardContent>
      <Skeleton height={10} style={{ marginBottom: 6 }} />
      <Skeleton height={10} width="80%" />
    </CardContent>
  </Card>
);

export const TextVariant = () => <Skeleton height={10} width="80%" />;

export const RectVariant = () => <Skeleton variant="rect" height={120} width={160} />;

export const CircleVariant = () => <Skeleton variant="circle" height={40} width={40} />;

export const PulseAnimation = () => <Skeleton animation="pulse" variant="rect" height={120} width={160} />;

export const WaveAnimation = () => <Skeleton animation="wave" variant="rect" height={120} width={160} />;

export const NoAnimation = () => <Skeleton animation={false} variant="rect" height={120} width={160} />;
