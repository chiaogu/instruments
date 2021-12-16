/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRenderer } from './useRenderer';
import { getGifFrames } from './utils';

const classes = {
  root: css`
    position: relative;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    overflow: hidden;
  `,
  canvas: css`
    width: 100%;
    height: 100%;
  `,
  loadingMask: css`
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #000;
    color: #fff;
  `,
};

function useGifFrames(gif) {
  const [gifWithFrames, setGifWithFrames] = useState(gif);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setGifWithFrames(gif);
      setLoading(true);
      const frames = await getGifFrames(gif.url);
      setGifWithFrames({
        ...gif,
        frames,
      });
      setLoading(false);
    })();
  }, [gif]);

  return { isLoading, gifWithFrames };
}

export default function GifPlayer({ gif }) {
  const canvasRef = useRef();
  const { isLoading, gifWithFrames } = useGifFrames(gif);
  
  useRenderer(canvasRef, gifWithFrames);

  return (
    <div css={classes.root}>
      <canvas ref={canvasRef} css={classes.canvas} />
      {isLoading && <div css={classes.loadingMask}>Loading...</div>}
    </div>
  );
}
