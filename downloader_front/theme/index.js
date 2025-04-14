// theme/index.js
const colors = {
  primary: '#4F46E5',      // Indigo
  secondary: '#6366F1',
  background: '#F9FAFB',
  text: '#111827',
  muted: '#6B7280',
  white: '#FFFFFF',
  danger: '#EF4444', // Pour relever toute erreur
};

export const fonts = {
  bold: 'Roboto-Bold',
  regular: 'Roboto-Regular',
};

export const spacing = {
  small: 8,
  medium: 16,
  large: 24,
};

export const useTheme = () => ({
  colors,
  fonts,
  spacing,
});
