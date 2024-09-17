const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark
  }
};

const theme = {
  primary: '#161622',
  secondary: {
    DEFAULT: '#FF9C01',
    100: '#FF9001',
    200: '#FF8E01'
  },
  black: {
    DEFAULT: '#000',
    100: '#1E1E2D',
    200: '#232533'
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
