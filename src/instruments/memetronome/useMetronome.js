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
      Tone.Transport.setLoopPoints(0, '4n');
      Tone.Transport.loop = true;
      eventId = Tone.Transport.scheduleRepeat(time => {
        if(isDownbeat) {
          synth.triggerAttackRelease('C4', '8n', time);
        }
        isDownbeat = !isDownbeat;
      }, '8n');
      Tone.Transport.start();
    }
    return () => {
      Tone.Transport.clear(eventId);
      Tone.Transport.stop();
    }
  }, [active]);
  
  async function toggle() {
    await Tone.start();
    setActive(!active);
  }
  
  function setBpm(value) {
    setUIBpm(value);
    Tone.Transport.bpm.setValueAtTime(value, Tone.now());
  }
  
  useEffect(() => {
    setBpm(110);
  }, []);
  
  return {
    toggle,
    active,
    bpm,
    setBpm,
  }
}
