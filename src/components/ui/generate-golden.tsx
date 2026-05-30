export type GoldenSquare = {
  top: number;
  left: number;
  size: number;
  dx: number;
  dy: number;
};

const phi = 1.618;

export const generateGoldenSquare = ({
  divRef,
  count,
}: {
  divRef: React.RefObject<HTMLDivElement | null>;
  count: number;
}): GoldenSquare[] => {
  if (!divRef.current) return [];

  const { width, height } = divRef.current.getBoundingClientRect();

  let w: number;
  let h: number;

  if (width >= height * phi) {
    h = height;
    w = height * phi;
  } else {
    w = width;
    h = width / phi;
  }

  const squares: GoldenSquare[] = [];

  let x = width - w;
  let y = 0;

  const dirs = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: -1 },
  ];

  for (let i = 0; i < count; i++) {
    const d = i % 4;
    const s = Math.min(w, h);

    switch (d) {
      case 0:
        squares.push({
          left: x,
          top: y,
          size: s,
          ...dirs[d],
        });

        x += s;
        w -= s;
        break;

      case 1:
        squares.push({
          left: x,
          top: y,
          size: s,
          ...dirs[d],
        });

        y += s;
        h -= s;
        break;

      case 2:
        squares.push({
          left: x + (w - s),
          top: y,
          size: s,
          ...dirs[d],
        });

        w -= s;
        break;

      case 3:
        squares.push({
          left: x,
          top: y + (h - s),
          size: s,
          ...dirs[d],
        });

        h -= s;
        break;
    }
  }

  return squares;
};