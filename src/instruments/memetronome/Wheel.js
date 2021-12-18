/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { useState, useEffect } from 'react';

const classes = {
  root: css`
    position: relative;
    z-index: 0;
    border-radius: 50%;
    overflow: hidden;
    background-color: #fff;
    box-shadow: -2px 4px 10px 0px rgb(0 0 0 / 11%);
    touch-action: none;
  `,
  wheel: css`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  `,
  indicator: css`
    width: 10px;
    height: 10px;
    margin-left: 15px;
    border-radius: 50%;
    background-color: #000;
  `,
};

function getAngle(p1, p2) {
  const radians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  return (radians * 180) / Math.PI + 180;
}

function useTouch(defaultAngle) {
  const [pressedState, setPressedState] = useState();
  const [angle, setAngle] = useState(defaultAngle);

  useEffect(() => {
    let previous;
    let totalDiff = 0;
    
    function onMove({ clientX: x, clientY: y }) {
      const currentPointerAngle = getAngle(pressedState.center, { x, y });
      if (previous !== undefined) {
        let diff = (currentPointerAngle - previous + 360) % 360;
        if (diff > 180) diff -= 360;
        totalDiff += diff;
        setAngle(Math.max(0, Math.min(360, pressedState.angle + totalDiff)));
      }
      previous = currentPointerAngle;
    }

    function onTouchMove({ touches }) {
      onMove(touches[0]);
    }

    function onRelease() {
      setPressedState();
    }

    if (pressedState) {
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
  }, [pressedState, setPressedState]);

  return {
    angle,
    isPressed: !!pressedState,
    onPress(event) {
      event.preventDefault();
      const { target, clientX, clientY } = event;
      const { left, top, width, height } = target.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      setPressedState({
        angle,
        center: { x, y },
        pointer: { x: clientX, y: clientY },
      });
    },
  };
}

export default function Wheel({ className, onChange }) {
  const { angle, onPress } = useTouch(120);
  
  useEffect(() => {
    onChange(angle / 360);
  }, [angle, onChange]);

  return (
    <div
      css={classes.root}
      className={className}
      onMouseDown={onPress}
      onTouchStart={onPress}
    >
      <div
        css={classes.wheel}
        style={{
          transform: `rotate(${angle}deg)`,
        }}
      >
        <div css={classes.indicator}></div>
      </div>
    </div>
  );
}
