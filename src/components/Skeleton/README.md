# `Skeleton`

Display a placeholder preview of your content before the data gets loaded to reduce load-time frustration.

The data for your components might not be immediately available. You can increase the perceived performance for users by using skeletons. It feels like things are happening immediately, then the information is incrementally displayed on the screen.

# Example

```jsx
import React from 'react';
import { Skeleton } from 'react-essential-tools';

export const Demo = () => (
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
```