import React, { ReactElement } from 'react';

import { CircularProgress } from '../CircularProgress';

export default {
  title: 'Components|CircularProgress',
};

export const Indeterminate = (): ReactElement => <CircularProgress variant="indeterminate" />;

export const Determinate = (): ReactElement => <CircularProgress variant="determinate" value={30} />;

export const Stable = (): ReactElement => <CircularProgress variant="stable" value={90} />;

export const WithDisableShrink = (): ReactElement => <CircularProgress variant="indeterminate" disableShrink />;
