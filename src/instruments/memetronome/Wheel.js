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

function useTouch() {
  const [pressedPos, setPressedPos] = useState();
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    function onMove({ clientX: x, clientY: y }) {
      const radians = Math.atan2(y - pressedPos.y, x - pressedPos.x);
      setAngle((radians * 180) / Math.PI + 180);
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
    angle,
    isPressed: !!pressedPos,
    onPress({ target }) {
      const { left, top, width, height } = target.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      setPressedPos({ x, y });
    },
  };
}

export default function Wheel({ className, onChange }) {
  const { angle, onPress } = useTouch();
  
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
