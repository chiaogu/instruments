import { useState, useEffect } from 'react';
import { getAngle } from '../utils';

export function createRotateHook({
  calculateDiff = ({ diff }) => diff,
  onAngleChange = ({ angle, setAngle }) => setAngle(angle),
} = {}) {
  return function useRotate(angle, setAngle) {
    const [pressedState, setPressedState] = useState();

    useEffect(() => {
      let previous;
      let totalDiff = 0;
      
      function setStartAngle(angle) {
        setPressedState({
          ...pressedState,
          angle,
        })
      }
      
      function getCurrentAngle() {
        let angle = (pressedState.angle + totalDiff) % 360;
        if (angle < 0) angle += 360;
        return angle;
      }

      function onMove({ clientX: x, clientY: y }) {
        const currentAngle = getAngle(pressedState.center, { x, y });
        if (previous !== undefined) {
          const startAngle = pressedState.angle;

          let diff = (currentAngle - previous + 360) % 360;
          if (diff > 180) diff -= 360;
          totalDiff += calculateDiff({
            diff,
            angle: getCurrentAngle(),
            startAngle,
          });

          onAngleChange({
            angle: getCurrentAngle(),
            setAngle,
            totalDiff,
            startAngle,
            setStartAngle,
          });
        }
        previous = currentAngle;
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
    }, [pressedState, setPressedState, setAngle]);

    return {
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
  };
}

export default createRotateHook();
