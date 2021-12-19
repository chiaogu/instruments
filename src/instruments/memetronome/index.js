/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { useRef } from 'react';
import { useEffect, useState } from 'react/cjs/react.development';
import Memetronome from './Memetronome';

const classes = {
  page: css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #444;
    overflow: hidden;
  `,
  frame: css`
    padding: 30px;
    transform-origin: 50% 50%;
  `,
};

function useDimensions(frameRef) {
  const [scale, setScale] = useState(1);
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    let frameDimensions;

    function checkScale() {
      if (!frameDimensions) {
        const { width, height } = frameRef.current.getBoundingClientRect();
        frameDimensions = { width, height };
      }

      const { innerWidth, innerHeight } = window;
      setViewport({ width: innerWidth, height: innerHeight });
      
      const widthScale = innerWidth / frameDimensions.width;
      const heightScale = innerHeight / frameDimensions.height;
      setScale(Math.min(widthScale, heightScale, 1));
    }

    checkScale();
    screen?.orientation?.addEventListener('change', checkScale);
    window.addEventListener('resize', checkScale);

    return () => {
      window.removeEventListener('resize', checkScale);
      screen?.orientation?.removeEventListener('change', checkScale);
    };
  }, [frameRef, setScale, setViewport]);

  return { scale, viewport };
}

export default function MemetronomePage() {
  const frameRef = useRef();
  const { scale, viewport } = useDimensions(frameRef);

  return (
    <div css={classes.page} style={viewport}>
      <div
        css={classes.frame}
        ref={frameRef}
        style={{ transform: `scale(${scale})` }}
      >
        <Memetronome />
      </div>
    </div>
  );
}
