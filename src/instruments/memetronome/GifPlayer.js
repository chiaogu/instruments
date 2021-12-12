import React, { useEffect, useRef } from 'react';
import { useState } from 'react/cjs/react.development';
import { getGifFrames, drawOnOffScreenCanvas } from './utils';

const url = 'https://media.giphy.com/media/5zosFvohZrssDQyl0m/giphy.gif';


function useGifFrames(url) {
  const [frames, setFrames] = useState([]);
  const [isLoading, setLoading] = useState(false);
  
  useEffect(() => {
    (async () => {
      setLoading(true);
      const frames = await getGifFrames(url);
      setFrames(frames);
      setLoading(false);
    })();
  }, [url]);
  
  return { isLoading, frames };
}

function useDraw(ctx, frames) {
  useEffect(() => {
    let animationId;
    let index = 0;
    let frameImageData;
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    function renderFrame(i) {
      const frame = frames[i];
      
      if (frame.disposalType ===  2) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
      
      if (
        !frameImageData ||
        frame.dims.width != frameImageData.width ||
        frame.dims.height != frameImageData.height
      ) {
        tempCanvas.width = frame.dims.width;
        tempCanvas.height = frame.dims.height;
        frameImageData = tempCtx.createImageData(frame.dims.width, frame.dims.height);
      }

      frameImageData.data.set(frame.patch);
      tempCtx.putImageData(frameImageData, 0, 0);
      ctx.drawImage(tempCanvas, frame.dims.left, frame.dims.top);
    }

    function draw() {
      renderFrame(index);
      index ++;
      index %= frames.length;
      setTimeout(() => {
        animationId = requestAnimationFrame(draw);
      }, 50);
    }
    
    if(ctx && frames.length > 0) {
      draw();
    }
    
    return () => {
      if(animationId) cancelAnimationFrame(animationId);
    }
  }, [frames]);
}

export default function GifPlayer() {
  const canvasRef = useRef();
  const { isLoading, frames} = useGifFrames(url);
  const ctx = canvasRef?.current?.getContext('2d');
  
  useEffect(() => {
    if(frames.length > 0) {
      const canvas = canvasRef.current;
      canvas.width = frames[0].dims.width;
      canvas.height = frames[0].dims.height;
    }
  }, [frames]);
  
  useDraw(ctx, frames);
  
  return (
    <canvas ref={canvasRef}/>
  );
}