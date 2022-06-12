import React from 'react';
import { ApplicationTopBar } from '../lib/components/application-top-bar';

export default function Home() {
  return (
    <React.Fragment>
      <ApplicationTopBar />
      <div>This is a Home component</div>
    </React.Fragment>
  );
}
