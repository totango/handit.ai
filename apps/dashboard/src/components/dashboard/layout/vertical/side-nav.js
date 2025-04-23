import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowSquareOut as ArrowSquareOutIcon } from '@phosphor-icons/react/dist/ssr/ArrowSquareOut';
import { CaretDown as CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { CaretRight as CaretRightIcon } from '@phosphor-icons/react/dist/ssr/CaretRight';
import { CaretLeft as CaretLeftIcon } from '@phosphor-icons/react';

import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { useSettings } from '@/hooks/use-settings';
import { Logo } from '@/components/core/logo';

import { icons } from '../nav-icons';
import { WorkspacesSwitch } from '../workspaces-switch';
import { navColorStyles } from './styles';

const logoColors = {
  dark: { blend_in: 'light', discrete: 'light', evident: 'light' },
  light: { blend_in: 'dark', discrete: 'dark', evident: 'light' },
};

export function SideNav({ color = 'evident', items = [], open, setOpen }) {
  const pathname = usePathname();
  const {
    settings: { colorScheme = 'light' },
  } = useSettings();
  const styles = navColorStyles[colorScheme][color];
  const navWidth = open ? '280px' : '84px';

  // Hover handlers for auto-expand/collapse
  const handleMouseEnter = () => {
    if (!open) setOpen(true);
  };
  const handleMouseLeave = () => {
    if (open) setOpen(false);
  };

  return (
    <Box
      sx={{
        ...styles,
        bgcolor: 'var(--SideNav-background)',
        borderRight: 'var(--SideNav-border)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        position: 'fixed',
        top: 0,
        width: navWidth,
        zIndex: 'var(--SideNav-zIndex)',
        transition: 'width 0.2s cubic-bezier(.4,0,.2,1)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* No toggle button, just hover to expand/collapse */}
      <Stack spacing={2} sx={{ p: 2, minHeight: 0, pl: '14px' }}>
        {pathname !== '/smart-review-tool' && (open ? (
          <WorkspacesSwitch />
        ) : <WorkspacesSwitch onlyIcon />)}
      </Stack>
      <Box
        component="nav"
        sx={{
          flex: '1 1 auto',
          overflowY: 'auto',
          p: 2,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {renderNavGroups({ items, pathname, open })}
      </Box>
    </Box>
  );
}

function renderNavGroups({ items, pathname, open }) {
  const children = items.reduce((acc, curr) => {
    acc.push(
      <Stack component="li" key={curr.key} spacing={1.5}>
        {pathname !== '/smart-review-tool' && curr.title ? (
          <div>
            <Typography sx={{ color: 'var(--NavGroup-title-color)', fontSize: '0.875rem', fontWeight: 500 }}>
              {open ? curr.title : null} 
              {!open && <hr style={{ border: '1px solid var(--NavGroup-title-color)', margin: '9.5px 16px' }} />}
            </Typography>
          </div>
        ) : null}
        <div>{renderNavItems({ depth: 0, items: curr.items, pathname, open })}</div>
      </Stack>
    );
    return acc;
  }, []);
  return (
    <Stack component="ul" spacing={2} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

function renderNavItems({ depth = 0, items = [], pathname, open }) {
  const children = items.reduce((acc, curr) => {
    const { items: childItems, key, ...item } = curr;
    const forceOpen = childItems
      ? Boolean(childItems.find((childItem) => childItem.href && pathname.startsWith(childItem.href)))
      : false;
    acc.push(
      <NavItem depth={depth} forceOpen={forceOpen} key={key} pathname={pathname} open={open} {...item}>
        {childItems ? renderNavItems({ depth: depth + 1, pathname, items: childItems, open }) : null}
      </NavItem>
    );
    return acc;
  }, []);
  return (
    <Stack component="ul" data-depth={depth} spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

function NavItem({
  children,
  depth,
  disabled,
  external,
  forceOpen = false,
  href,
  icon,
  label,
  matcher,
  pathname,
  title,
  open: navOpen,
}) {
  const [open, setOpen] = React.useState(forceOpen);
  const [modelId, setModelId] = React.useState(null);
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? icons[icon] : null;
  const ExpandIcon = open ? CaretDownIcon : CaretRightIcon;
  const isBranch = children && !href;
  const showChildren = Boolean(children && open);
  const searchParams = useSearchParams();
  React.useEffect(() => {
    // Get the 'modelId' from the current search parameters
    const newModelId = searchParams.get('modelId');
    // Update state if modelId changes
    if (newModelId !== modelId) {
      setModelId(newModelId);
    }
  }, [searchParams, modelId]);
  return (
    <Box component="li" data-depth={depth} sx={{ userSelect: 'none' }}>
      <Box
        {...(isBranch
          ? {
              onClick: () => {
                setOpen(!open);
              },
              onKeyUp: (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  setOpen(!open);
                }
              },
              role: 'button',
            }
          : {
              ...(href
                ? {
                    component: external ? 'a' : RouterLink,
                    href: href + (href === '/dynamic-review' && modelId !== null ? '?modelId=' + modelId : ''),
                    target: external ? '_blank' : undefined,
                    rel: external ? 'noreferrer' : undefined,
                  }
                : { role: 'button' }),
            })}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--NavItem-color)',
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1,
          p: navOpen ? '6px 16px' : '6px 16px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(active && {
            bgcolor: 'var(--NavItem-active-background)',
            color: 'var(--NavItem-active-color)',
            ...(depth > 0 && {
              '&::before': {
                bgcolor: 'var(--NavItem-children-indicator)',
                borderRadius: '2px',
                content: '" "',
                height: '20px',
                left: '-14px',
                position: 'absolute',
                width: '3px',
              },
            }),
          }),
          ...(open && { color: 'var(--NavItem-open-color)' }),
          '&:hover': {
            ...(!disabled &&
              !active && { bgcolor: 'var(--NavItem-hover-background)', color: 'var(--NavItem-hover-color)' }),
          },
        }}
        tabIndex={0}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
          {Icon ? (
            <Icon
              fill={active ? 'var(--NavItem-active-color)' : 'var(--NavItem-color)'}
              fontSize="var(--icon-fontSize-md)"
              weight={forceOpen || active ? 'fill' : undefined}
            />
          ) : null}
        </Box>
        {(
          <Box sx={{ flex: '1 1 auto' }}>
            {pathname !== '/smart-review-tool' && <Typography
              component="span"
              sx={{ color: navOpen ? 'inherit' : 'transparent', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
            >
              {title}
            </Typography>}
          </Box>
        )}
        {navOpen && label ? <Chip color="primary" label={label} size="small" /> : null}
        {external && navOpen ? (
          <Box sx={{ alignItems: 'center', display: 'flex', flex: '0 0 auto' }}>
            <ArrowSquareOutIcon color="var(--NavItem-icon-color)" fontSize="var(--icon-fontSize-sm)" />
          </Box>
        ) : null}
        {isBranch && navOpen && pathname !== '/smart-review-tool' ? (
          <Box sx={{ alignItems: 'center', display: 'flex', flex: '0 0 auto' }}>
            <ExpandIcon color="var(--NavItem-expand-color)" fontSize="var(--icon-fontSize-sm)" />
          </Box>
        ) : null}
      </Box>
      {showChildren && navOpen && pathname !== '/smart-review-tool' ? (
        <Box sx={{ pl: '24px' }}>
          <Box sx={{ borderLeft: '1px solid var(--NavItem-children-border)', pl: '12px' }}>{children}</Box>
        </Box>
      ) : null}
    </Box>
  );
}
