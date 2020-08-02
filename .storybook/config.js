import React, { StrictMode } from 'react';
import { configure, addDecorator } from '@storybook/react';

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.(js|ts)x?$/), module);

addDecorator((storyFn) => (
  <StrictMode>
    {storyFn()}
  </StrictMode>
));
