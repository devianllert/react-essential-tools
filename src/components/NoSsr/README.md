# `NoSsr`

NoSsr purposely removes components from the subject of Server Side Rendering (SSR).

This component can be useful in a variety of situations:
- Escape hatch for broken dependencies not supporting SSR.
- Improve the time-to-first paint on the client by only rendering above the fold.
- Reduce the rendering time on the server.
- Under too heavy server load, you can turn on service degradation.
- Improve the time-to-interactive by only rendering what's important (with the defer property).

# Example

```jsx
import React from 'react';
import { NoSsr } from 'react-essential-tools';

export default function SimpleNoSsr() {
  return (
    <div>
      <div>
        Server and Client
      </div>

      <NoSsr>
        <div>
          Client only
        </div>
      </NoSsr>
    </div>
  );
}
```