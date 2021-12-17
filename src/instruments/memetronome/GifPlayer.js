/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { useState, useEffect, useRef } from 'react';
import { useRenderer } from './useRenderer';
import { getGifFrames } from './utils';

const classes = {
  root: css`
    position: relative;
    z-index: 0;
    border-radius: 50%;
    overflow: hidden;
  `,
  canvas: css`
    width: 100%;
    height: 100%;
  `,
  mask: css`
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: -2px 5px 8px 0px rgb(0 0 0 / 20%) inset;
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

export default function GifPlayer({ gif, className }) {
  const canvasRef = useRef();
  const { isLoading, gifWithFrames } = useGifFrames(gif);

  useRenderer(canvasRef, gifWithFrames);

  return (
    <div css={classes.root} className={className}>
      <canvas ref={canvasRef} css={classes.canvas} />
      {isLoading && <div css={classes.loadingMask}>Loading...</div>}
      <div css={classes.mask}></div>
    </div>
  );
}
