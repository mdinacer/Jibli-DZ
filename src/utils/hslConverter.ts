type RGB = [number, number, number];

export function hslToRgb(h: number, s: number, l: number): RGB {
  // Convert h, s, l from [0, 1] range
  h = h % 360; // Ensure h is within [0, 360]
  s = s / 100; // Convert s to [0, 1]
  l = l / 100; // Convert l to [0, 1]

  let r: number, g: number, b: number;

  if (s === 0) {
    // Achromatic (grey)
    r = g = b = l; // This will be a value between 0 and 1
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const hueToRgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    r = hueToRgb(p, q, h / 360 + 1 / 3);
    g = hueToRgb(p, q, h / 360);
    b = hueToRgb(p, q, h / 360 - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

export function parseHSL(hslString: string): [number, number, number] | null {
  // Regular expression to match the HSL format
  const regex = /^hsl\(\s*(\d+)\s+(\d+(\.\d+)?)%\s+(\d+(\.\d+)?)%\s*\)$/;
  const match = hslString.match(regex);

  if (match) {
    // Extract the values from the regex match
    const h = parseInt(match[1], 10); // Hue
    const s = parseFloat(match[2]); // Saturation
    const l = parseFloat(match[4]); // Lightness

    return [h, s, l];
  }

  // Return null if the input is not a valid HSL string
  return null;
}
