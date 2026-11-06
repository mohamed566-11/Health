export const COLORS = {
  darkTeal: '#0B434C',
  white: '#FFFFFF',
  neonOrange: '#FF5533',
  red: '#D94848',
  green: '#23845C',
  background: '#F5F8F8',
  lightTeal: '#EDF5F5',
  primaryText: '#16363A',
  secondaryText: '#708486',
  border: '#E3EBEA',
  muted: '#F2F6F5',
  tealHover: '#08333A',
  tealPressed: '#06252A',
  tealSubtle: '#E5F0F1',
  tealMid: '#165B66',
  orangeHover: '#E64525',
  orangePressed: '#CC391B',
  orangeSubtle: '#FFF2EF',
  greenSubtle: '#EAF5F0',
  redSubtle: '#FCEEEE',
} as const;

export type ColorToken = keyof typeof COLORS;
