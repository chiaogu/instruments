import { useEffect } from 'react';
import * as Tone from 'tone';

function trackProgress({ frames, beats, offset }, render) {
  let toneProgress = Tone.Transport.progress;
  let loopCount = 0;
  let frameIndex = offset;
  
  return function tick() {
    if(Tone.Transport.progress < toneProgress) {
      loopCount++;
      loopCount %= beats
    }
    toneProgress = Tone.Transport.progress;
    
    const progress = (loopCount + Tone.Transport.progress) / beats;
    const index = (Math.round(progress * frames.length) + offset) % frames.length;
    
    if(index != frameIndex) {
      render(index);
      frameIndex = index;
    } 
  };
}

function offscreenCanvas() {
  let frameImageData;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  return function get(frame) {
    if (
      !frameImageData ||
      frame.dims.width != frameImageData.width ||
      frame.dims.height != frameImageData.height
    ) {
      canvas.width = frame.dims.width;
      canvas.height = frame.dims.height;
      frameImageData = ctx.createImageData(
        frame.dims.width,
        frame.dims.height
      );
    }

    frameImageData.data.set(frame.patch);
    ctx.putImageData(frameImageData, 0, 0);
    return canvas;
  };
}

function loop(callback) {
  let animationId;
  let cancelled = false;
  
  function tick() {
    callback();
    if (!cancelled) {
      animationId = requestAnimationFrame(tick);
    }
  }
  
  tick();
  
  return function cancel() {
    cancelled = true;
    if (animationId) cancelAnimationFrame(animationId);
  }
}

export function useRenderer(canvasRef, gif) {
  useEffect(() => {
    let cancelLoop;
    const { frames = [], offset, left = 0 } = gif;
    const getFrameImage = offscreenCanvas();
    const ctx = canvasRef?.current?.getContext('2d');

    function renderFrame(i) {
      const frame = frames[i];
      
      if (frame.disposalType === 2) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }

      const viewportOffset = (frames[0].dims.width - ctx.canvas.width) / 2;
      ctx.drawImage(getFrameImage(frame), frame.dims.left - viewportOffset + left, frame.dims.top);
      
      // ctx.beginPath();
      // ctx.rect(0, ctx.canvas.height / 2, ctx.canvas.width * Tone.Transport.progress, 10);
      // ctx.fillStyle = '#f00';
      // ctx.fill();
    }

    if (ctx && frames.length > 0) {
      const { width, height } = frames[0].dims;
      const short = Math.min(width, height);
      ctx.canvas.width = short;
      ctx.canvas.height = short;
      
      for(let i = 0; i <= offset; i++) {
        renderFrame(i);
      }

      const updateProgress = trackProgress(gif, renderFrame);
      cancelLoop = loop(updateProgress);
    }

    return () => {
      if(cancelLoop) {
        cancelLoop();
      }
    };
  }, [canvasRef, gif]);
}
