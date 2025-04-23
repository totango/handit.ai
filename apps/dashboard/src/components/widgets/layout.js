/**
 * @fileoverview Layout component for widget display and navigation
 * Provides a consistent layout structure for component previews with breadcrumb navigation
 */

import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

import { paths } from '@/paths';
import { BreadcrumbsSeparator } from '@/components/core/breadcrumbs-separator';
import { Previewer } from '@/components/widgets/previewer';

/**
 * Layout component for widget display and navigation
 * @component
 * @param {Object} props - Component props
 * @param {Array<{title: string, href: string}>} [props.breadcrumbs] - Navigation breadcrumbs
 * @param {Array<{title: string, element: React.ReactNode}>} props.components - Components to preview
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Rendered layout component
 * 
 * @description
 * This component provides:
 * - Consistent page layout structure
 * - Breadcrumb navigation
 * - Component preview sections
 * - Back to components navigation
 * - Responsive container layout
 * - Material-UI integration
 */
export function Layout({ breadcrumbs, components, title }) {
  return (
    <main>
      {/* Header section with navigation */}
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-level1)',
          borderBottom: '1px solid var(--mui-palette-divider)',
          py: '120px',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            {/* Back to components link */}
            {!breadcrumbs ? (
              <div>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.components.index}
                  sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
                  variant="subtitle2"
                >
                  <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
                  Components
                </Link>
              </div>
            ) : null}

            {/* Page title */}
            <div>
              <Typography variant="h1">{title}</Typography>
            </div>

            {/* Breadcrumb navigation */}
            {breadcrumbs ? (
              <div>
                <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                  {breadcrumbs.map((breadcrumb, index) => {
                    if (breadcrumbs.length - 1 === index) {
                      return (
                        <Typography color="text.secondary" key={breadcrumb.title} variant="subtitle2">
                          {breadcrumb.title}
                        </Typography>
                      );
                    }

                    return (
                      <Link
                        color="text.primary"
                        component={RouterLink}
                        href={breadcrumb.href}
                        key={breadcrumb.title}
                        variant="subtitle2"
                      >
                        {breadcrumb.title}
                      </Link>
                    );
                  })}
                </Breadcrumbs>
              </div>
            ) : null}
          </Stack>
        </Container>
      </Box>

      {/* Component preview section */}
      <Box sx={{ py: '64px' }}>
        <Container maxWidth="lg">
          <Stack spacing={8}>
            {components.map((component) => (
              <Previewer key={component.title} title={component.title}>
                {component.element}
              </Previewer>
            ))}
          </Stack>
        </Container>
      </Box>
    </main>
  );
}
