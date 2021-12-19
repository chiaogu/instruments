/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { useState } from 'react';
import GifPlayer from './GifPlayer';
import Wheel from './Wheel';
import useMetronome from './useMetronome';
import gifs from './gifs.json';

const classes = {
  root: css`
    position: relative;
    width: 400px;
    height: 800px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background-color: #eee;
    box-shadow: -2px 6px 14px 0px rgba(0, 0, 0, 0.39);
  `,
  gif: css`
    width: 280px;
    height: 280px;
  `,
  buttons: css`
    display: flex;
    margin: 50px;
  `,
  bpm: css`
    padding: 0 60px;
  `,
  wheel: css`
    width: 280px;
    height: 280px;
  `,
};

export default function Memetronome() {
  const { active, toggle, bpm, setBpm } = useMetronome();
  const [gifIndex, setGifIndex] = useState(0);
  const onClickChange = () => setGifIndex((gifIndex + 1) % gifs.length);

  return (
    <div css={classes.root}>
      <GifPlayer css={classes.gif} gif={gifs[gifIndex]} />
      <div css={classes.buttons}>
        <button onClick={onClickChange}>Change</button>
        <div css={classes.bpm}>{bpm}</div>
        <button onClick={toggle}>{active ? 'Stop' : 'Play'}</button>
      </div>
      <Wheel
        css={classes.wheel}
        onChange={(value) => setBpm(Math.round(40 + 210 * value))}
      />
    </div>
  );
}
