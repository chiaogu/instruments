/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { useEffect, useRef } from 'react';
import { useGifFrames, useDraw } from './hooks';

const url = 'https://media.giphy.com/media/5zosFvohZrssDQyl0m/giphy.gif';

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

export default function GifPlayer() {
  const canvasRef = useRef();
  const { isLoading, frames } = useGifFrames(url);
  const ctx = canvasRef?.current?.getContext('2d');

  useEffect(() => {
    if (frames.length > 0) {
      const canvas = canvasRef.current;
      canvas.width = frames[0].dims.width;
      canvas.height = frames[0].dims.height;
    }
  }, [frames]);

  useDraw(ctx, frames);

  return (
    <div css={classes.root}>
      <canvas ref={canvasRef} css={classes.canvas} />
      {isLoading && <div css={classes.loadingMask}>Loading...</div>}
    </div>
  );
}
