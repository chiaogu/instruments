import { useState, useEffect, useCallback } from 'react';
import * as Tone from 'tone';

export default function useMetronome() {
  const [active, setActive] = useState(false);
  const [bpm, setUIBpm] = useState(Tone.Transport.bpm.value);
  const setBpm = useCallback((value) => {
    setUIBpm(value);
    Tone.Transport.bpm.setValueAtTime(value, Tone.now());
  }, [setUIBpm]);
  
  useEffect(() => {
    let eventId;
    if (active) {
      let isDownbeat = true;
      const synth = new Tone.MembraneSynth({ volume: 0 }).toDestination();
      synth.volume.value = -20;
      Tone.Transport.setLoopPoints(0, '4n');
      Tone.Transport.loop = true;
      eventId = Tone.Transport.scheduleRepeat((time) => {
        if (isDownbeat) {
          // synth.triggerAttackRelease('C4', '8n', time);
        }
        isDownbeat = !isDownbeat;
      }, '8n');
      Tone.Transport.start();
    }
    return () => {
      Tone.Transport.clear(eventId);
      Tone.Transport.stop();
    };
  }, [active]);

  return {
    bpm,
    setBpm,
    active,
    setActive,
  };
}
