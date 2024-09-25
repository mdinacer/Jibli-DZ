const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export type ThemeType = {
  border: string;
  input: string;
  ring: string;
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  destructive: string;
  destructiveForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  popover: string;
  popoverForeground: string;
  card: string;
  cardForeground: string;
};

export default {
  light: {
    border: 'hsl(220 13% 91%)',
    input: 'hsl(220 13% 91%)',
    ring: 'hsl(224 71.4% 4.1%)',
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(224 71.4% 4.1%)',
    primary: 'hsl(220.9 39.3% 11%)',
    primaryForeground: 'hsl(210 20% 98%)',
    secondary: 'hsl(220 14.3% 95.9%)',
    secondaryForeground: 'hsl(220.9 39.3% 11%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    destructiveForeground: 'hsl(210 20% 98%)',
    muted: 'hsl(220 14.3% 95.9%)',
    mutedForeground: 'hsl(220 8.9% 46.1%)',
    accent: 'hsl(220 14.3% 95.9%)',
    accentForeground: 'hsl(220.9 39.3% 11%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(224 71.4% 4.1%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(224 71.4% 4.1%)'
  },
  dark: {
    border: 'hsl(215 27.9% 16.9%)',
    input: 'hsl(215 27.9% 16.9%)',
    ring: 'hsl(216 12.2% 83.9%)',
    background: 'hsl(224 71.4% 4.1%)',
    foreground: 'hsl(210 20% 98%)',
    primary: 'hsl(210 20% 98%)',
    primaryForeground: 'hsl(220.9 39.3% 11%)',
    secondary: 'hsl(215 27.9% 16.9%)',
    secondaryForeground: 'hsl(210 20% 98%)',
    destructive: 'hsl(0 62.8% 30.6%)',
    destructiveForeground: 'hsl(210 20% 98%)',
    muted: 'hsl(215 27.9% 16.9%)',
    mutedForeground: 'hsl(217.9 10.6% 64.9%)',
    accent: 'hsl(215 27.9% 16.9%)',
    accentForeground: 'hsl(210 20% 98%)',
    popover: 'hsl(224 71.4% 4.1%)',
    popoverForeground: 'hsl(210 20% 98%)',
    card: 'hsl(224 71.4% 4.1%)',
    cardForeground: 'hsl(210 20% 98%)'
  }
};

const gradientColors = [
  ['#764BA2', '#667EEA'],
  ['#D4145A', '#FBB03B'],
  ['#2E3192', '#1BFFFF'],
  ['#C33764', '#1D2671'],
  ['#009245', '#FCEE21'],
  ['#662D8C', '#ED1E79'],
  ['#EE9CA7', '#FFDDE1'],
  ['#614385', '#516395'],
  ['#02AABD', '#00CDAC'],
  ['#FF512F', '#DD2476'],
  ['#FF5F6D', '#FFC371'],
  ['#11998E', '#38EF7D'],
  ['#02AABD', '#00CDAC'],
  ['#09203F', '#537895']
];

export const getGradient = (index: number) => {
  return gradientColors[index % gradientColors.length];
};
