import { useEffect } from 'react';
import * as Tone from 'tone';

const meta = {
  offset: 13,
  beats: 2,
};

export function useRenderer(canvasRef, frames) {
  useEffect(() => {
    let animationId;
    let index = meta.offset;
    let frameImageData;
    let cancelled = false;
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    const ctx = canvasRef?.current?.getContext('2d');

    function renderFrame(i) {
      const frame = frames[i];
      
      // if (frame.disposalType === 2) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // }

      if (
        !frameImageData ||
        frame.dims.width != frameImageData.width ||
        frame.dims.height != frameImageData.height
      ) {
        tempCanvas.width = frame.dims.width;
        tempCanvas.height = frame.dims.height;
        frameImageData = tempCtx.createImageData(
          frame.dims.width,
          frame.dims.height
        );
      }

      frameImageData.data.set(frame.patch);
      tempCtx.putImageData(frameImageData, 0, 0);
      ctx.drawImage(tempCanvas, frame.dims.left, frame.dims.top);
      
      ctx.beginPath();
      ctx.rect(0, ctx.canvas.height / 2, ctx.canvas.width * Tone.Transport.progress, 10);
      ctx.fillStyle = '#f00';
      ctx.fill();
    }

    function draw() {
      renderFrame(index);
      index++;
      index %= frames.length;
      if (!cancelled) {
        animationId = requestAnimationFrame(draw);
      }
    }

    if (ctx && frames.length > 0) {
      ctx.canvas.width = frames[0].dims.width;
      ctx.canvas.height = frames[0].dims.height;
      
      for(let i = 0; i < meta.offset; i++) {
        renderFrame(i);
      }
      draw();
    }

    return () => {
      cancelled = true;
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [frames]);
}
