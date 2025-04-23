import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

import { colorSchemes } from './color-schemes';
import { components } from './components/components';
import { shadows } from './shadows';
import { typography } from './typography';

export function createTheme(config) {
  const theme = extendTheme({
    breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1440 } },
    colorSchemes: colorSchemes({ primaryColor: config.primaryColor }),
    components: {
      ...components,
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: '5px', boxShadow: '0 5px 22px 0 rgba(0, 0, 0, 0.24),0 0 0 1px rgba(255, 255, 255, 0.12)' },
        },
      },
    },
    direction: config.direction,
    shadows: config.colorScheme === 'dark' ? shadows.dark : shadows.light,
    shape: { borderRadius: 8 },
    typography,
  });

  return theme;
}
