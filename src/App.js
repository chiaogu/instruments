import { css, Global } from '@emotion/react';
import React from 'react';
import { Fragment } from 'react/cjs/react.production.min';
import Memetronome from './instruments/memetronome';

const globalStyles = css`
  body {
    display: flex;
    justify-content: start;
    align-items: flex-start;
    margin: 0;
    background: #000;
    overflow: hidden;
  }
`;

export default function App() {
  return (
    <Fragment>
      <Global styles={globalStyles} />
      <Memetronome />
    </Fragment>
  );
}
