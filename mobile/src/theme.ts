export const colors = {
  // Brand — richer for a tactile, realistic feel
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  accent: '#FB923C',

  // Surfaces
  background: '#F4F6F8',
  surface: '#FFFFFF',

  // Text / UI
  text: '#0B1220',
  muted: '#6B7280',
  border: '#E6EEF0',

  // Status
  success: '#10B981',
  danger: '#DC2626',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
};

export const typography = {
  h1: 28,
  h2: 22,
  h3: 18,
  body: 16,
  small: 13,
};

/**
 * Convert a hex color to an rgba() string with the given alpha (0-1).
 */
export function alpha(hex: string, a: number) {
  const cleaned = hex.replace('#', '');
  const bigint = parseInt(cleaned.length === 3 ? cleaned.split('').map((c) => c + c).join('') : cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export const elevation = {
  low: {
    shadowColor: alpha(colors.text, 0.06),
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: alpha(colors.text, 0.09),
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 4,
  },
  high: {
    shadowColor: alpha(colors.text, 0.12),
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 1,
    shadowRadius: 28,
    elevation: 8,
  },
};

export default { colors, spacing, radius, typography, alpha, elevation };
