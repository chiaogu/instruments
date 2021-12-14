import React, { useState } from 'react';
import GifPlayer from './GifPlayer';
import useMetronome from './useMetronome';
import gifs from './gifs.json';

export default function Memetronome() {
  const { active, toggle, bpm, setBpm } = useMetronome();
  const [gifIndex, setGifIndex] = useState(0);
  const onClickChange = () => setGifIndex((gifIndex + 1) % gifs.length);
  
  return (
    <div>
      <h2>Memetronome</h2>
      <GifPlayer gif={gifs[gifIndex]}/>
      <button onClick={onClickChange}>Change</button>
      <button onClick={toggle}>{active ? 'Stop' : 'Play'}</button>
      <div>{bpm}</div>
      <input
        type="range"
        value={bpm}
        min={40}
        max={250}
        onInput={({ target: { value } }) => setBpm(value)}
      />
    </div>
  );
}
