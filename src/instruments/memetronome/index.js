import React, { useEffect, useState } from 'react';
import useMetronome from './useMetronome';

export default function Memetronome() {
  const { active, toggle, bpm, setBpm } = useMetronome();
  
  return (
    <div>
      <h2>Memetronome</h2>
      <button
        onClick={toggle}
      >
        {active ? 'Stop' : 'Play'}
      </button>
      <div>{bpm}</div>
      <input
        type='range'
        value={bpm}
        min={40}
        max={250}
        onInput={({ target: { value }}) => setBpm(value)}
      />
    </div>
  )  
}
