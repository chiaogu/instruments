/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { useState, useEffect, useRef } from 'react';
import { useRenderer } from './useRenderer';

const classes = {
  root: css`
    position: relative;
    z-index: 0;
    border-radius: 50%;
    overflow: hidden;
    background-color: #fff;
    box-shadow: -2px 4px 10px 0px rgb(0 0 0 / 11%);
  `,
};

function useTouch() {
  const [pressedPos, setPressedPos] = useState();
  
  useEffect(() => {
    function onMove({ clientX: x, clientY: y }) {
      const radians = Math.atan2(y - pressedPos.y, x - pressedPos.x);
      const angle = (radians * 180) / Math.PI;
      console.log(angle);
    }
    
    function onTouchMove({ touches }) {
      onMove(touches[0]);
    }
    
    function onRelease() {
      setPressedPos();
    }
    
    if (pressedPos) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onRelease);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onRelease);
    }
    
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onRelease);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onRelease);
    };
  }, [pressedPos, setPressedPos]);
  
  return {
    isPressed: !!pressedPos,
    onPress({ clientX, clientY, target }) {
      console.log(target.getBoundingClientRect());
      setPressedPos({ x: clientX, y: clientY });
    },
  }
}

export default function Wheel({ className }) {
  const { onPress } = useTouch();
  
  return (
    <div
      css={classes.root}
      className={className}
      onMouseDown={onPress}
      onTouchStart={onPress}
    >
    </div>
  );
}
