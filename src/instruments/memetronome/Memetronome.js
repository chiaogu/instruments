/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { useCallback, useState } from 'react';
import GifPlayer from './GifPlayer';
import Wheel from './Wheel';
import useMetronome from './useMetronome';
import gifs from './gifs.json';
import * as Tone from 'tone';

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
  const { bpm, setBpm, setActive } = useMetronome();
  const [gifIndex, setGifIndex] = useState(0);
  const onClickChange = () => setGifIndex((gifIndex + 1) % gifs.length);
  const onWheelChange = useCallback((value) => {
    setActive(value !== null);
    if (value) {
      setBpm(Math.round(40 + 210 * value));
    } else {
      setBpm(1);
    }
  }, [setBpm, setActive]);

  return (
    <div css={classes.root}>
      <GifPlayer css={classes.gif} gif={gifs[gifIndex]} />
      <div css={classes.buttons}>
        <button onClick={onClickChange}>Change</button>
        <div css={classes.bpm}>{bpm}</div>
      </div>
      <Wheel css={classes.wheel} onChange={onWheelChange} onPress={Tone.start}/>
    </div>
  );
}
