import { Shape } from 'three';

export function frontIntakeShapes() {
  const upper = new Shape();
  upper.moveTo(-342, 760); upper.lineTo(342, 760);
  upper.lineTo(309, 668); upper.quadraticCurveTo(0, 650, -309, 668); upper.closePath();
  const lower = new Shape();
  lower.moveTo(-445, 486); lower.lineTo(445, 486);
  lower.lineTo(404, 354); lower.quadraticCurveTo(0, 339, -404, 354); lower.closePath();
  const pockets = [-1, 1].map(side => {
    const shape = new Shape();
    shape.moveTo(side * 518, 487);
    shape.quadraticCurveTo(side * 630, 490, side * 739, 477);
    shape.quadraticCurveTo(side * 770, 425, side * 734, 361);
    shape.lineTo(side * 530, 357);
    shape.quadraticCurveTo(side * 507, 410, side * 518, 487);
    shape.closePath();
    return shape;
  });
  return { upper, lower, pockets };
}