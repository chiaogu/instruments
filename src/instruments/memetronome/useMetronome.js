import { useState, useEffect } from 'react';
import * as Tone from 'tone';

export default function useMetronome() {
  const [active, setActive] = useState(false);
  const [bpm, setUIBpm] = useState(Tone.Transport.bpm.value);

  useEffect(() => {
    let eventId;
    if(active) {
      let isDownbeat = true;
      const synth = new Tone.MembraneSynth({ volume: 0 }).toDestination();
      synth.volume.value = -20;
      eventId = Tone.Transport.scheduleRepeat(time => {
        if(isDownbeat) {
          synth.triggerAttackRelease('C3', '8n', time);
        }
        isDownbeat = !isDownbeat;
      }, '8n');
      Tone.Transport.start();
    }
    return () => Tone.Transport.clear(eventId);
  }, [active]);
  
  async function toggle() {
    await Tone.start();
    setActive(!active);
  }
  
  function setBpm(value) {
    setUIBpm(value);
    Tone.Transport.bpm.setValueAtTime(value, Tone.now());
  }
  
  return {
    toggle,
    active,
    bpm,
    setBpm,
  }
}
