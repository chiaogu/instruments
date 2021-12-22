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

const TOGGLE_ANGLE = 20;
const RESISTANCE = 5;

const useRotate = createRotateHook({
  calculateDiff({ diff, angle }) {
    if (angle < TOGGLE_ANGLE || angle > 360 - TOGGLE_ANGLE) {
      return diff / 20;
    } else {
      return diff;
    }
  },
  onAngleChange({ angle, setAngle, totalDiff }) {
    if (totalDiff > 0) {
      if (angle < TOGGLE_ANGLE && angle > TOGGLE_ANGLE / RESISTANCE) {
        setAngle(TOGGLE_ANGLE, true);
      } else if (angle > 360 - (TOGGLE_ANGLE / RESISTANCE) * (RESISTANCE - 1)) {
        setAngle(0, true);
      } else {
        setAngle(angle);
      }
    } else {
      if (angle < (TOGGLE_ANGLE / RESISTANCE) * (RESISTANCE - 1)) {
        setAngle(0, true);
      } else if (
        angle < 360 - TOGGLE_ANGLE / RESISTANCE &&
        angle > 360 - (TOGGLE_ANGLE / RESISTANCE) * (RESISTANCE - 1)
      ) {
        setAngle(360 - TOGGLE_ANGLE, true);
      } else {
        setAngle(angle);
      }
    }
  },
  onRelease({ angle, setAngle }) {
    if (angle < TOGGLE_ANGLE / 2 || angle > 360 - TOGGLE_ANGLE / 2) {
      setAngle(0, true);
    } else if (angle >= TOGGLE_ANGLE / 2 && angle < TOGGLE_ANGLE) {
      setAngle(TOGGLE_ANGLE, true);
    } else if (angle > 360 - TOGGLE_ANGLE && angle < 360 - TOGGLE_ANGLE / 2) {
      setAngle(360 - TOGGLE_ANGLE, true);
    }
  },
});

export default function Wheel({ className, onChange, onPress: onPressExternal }) {
  const [angle, setAngle] = useState(0);
  const { onPress } = useRotate(angle, setAngle);

  useEffect(() => {
    if (angle < TOGGLE_ANGLE / 2 || angle > 360 - TOGGLE_ANGLE / 2) {
      onChange(null);
    } else {
      onChange((angle - TOGGLE_ANGLE) / (360 - TOGGLE_ANGLE * 2));
    }
  }, [angle, onChange]);
  
  function handlePress(event) {
    onPress(event);
    onPressExternal(event);
  }

  return (
    <div
      css={classes.root}
      className={className}
      onMouseDown={handlePress}
      onTouchStart={handlePress}
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
