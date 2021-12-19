/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { createRotateHook } from '../../hooks/useRotate';

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

const TOGGLE_ANGLE = 5;

const useRotate = createRotateHook({
  calculateDiff({ diff, angle }) {
    if (angle < TOGGLE_ANGLE || angle > 360 - TOGGLE_ANGLE) {
      return diff / 20;
    } else {
      return diff;
    }
  },
  onAngleChange({ angle, setAngle, totalDiff, startAngle, setStartAngle }) {
    console.log(angle);
    // if (startAngle < TOGGLE_ANGLE && totalDiff > TOGGLE_ANGLE / 5) {
    //   setAngle(TOGGLE_ANGLE);
    //   setStartAngle(TOGGLE_ANGLE);
    // } else {
      setAngle(angle);
    // }
  },
});

export default function Wheel({ className, onChange }) {
  const [angle, setAngle] = useState(0);
  const { onPress } = useRotate(angle, setAngle);

  useEffect(() => {
    // console.log(angle);
    // onChange(angle / 360);
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
