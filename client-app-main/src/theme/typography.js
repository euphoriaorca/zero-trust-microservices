import { pxToRem, responsiveFontSizes } from '../utils/getFontValue';

// -------------------------------------------------------------------//

// const FONT_PRIMARY = 'Public Sans, sans-serif'; // Google Font
const FONT_SECONDARY = 'SF Pro'; // Local Font

const typography = {
  fontFamily: FONT_SECONDARY,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightLight: 100,
  fontWeightBold: 700,
  h1: {
    fontWeight: 700,
    lineHeight: 32 / 40,
    fontSize: pxToRem(32),
    letterSpacing: 2,
    ...responsiveFontSizes({ sm: 24, md: 26, lg: 28 }),
  },
  h2: {
    fontWeight: 700,
    lineHeight: 24 / 32,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }),
  },
  h3: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 18, md: 18, lg: 20 }),
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
  },
  h5: {
    fontWeight: 700,
    lineHeight: 16 / 24,
    fontSize: pxToRem(16),
    ...responsiveFontSizes({ sm: 13, md: 16, lg: 16 }),
  },
  h6: {
    fontWeight: 510,
    lineHeight: 12 / 16,
    fontSize: pxToRem(12),
    ...responsiveFontSizes({ sm: 12, md: 12, lg: 12 }),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 14 / 24,
    fontSize: pxToRem(14),
  },
  subtitle2: {
    fontWeight: 400,
    lineHeight: 14 / 24,
    fontSize: pxToRem(14),
  },
  body1: {
    fontWeight: 500,
    lineHeight: 14 / 24,
    fontSize: pxToRem(14),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: 'capitalize',
  },
};

export default typography;
