/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import Memetronome from './Memetronome';

const classes = {
  page: css`
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #444;
  `,
};

export default function MemetronomePage() {
  return (
    <div css={classes.page}>
      <Memetronome/>
    </div>
  );
}
