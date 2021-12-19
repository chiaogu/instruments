export function getAngle(p1, p2) {
  const radians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  return (radians * 180) / Math.PI + 180;
}
