export function isNavItemActive({ disabled, external, href, matcher, pathname }) {
  if (disabled || !href || external) {
    return false;
  }

  if (matcher) {
    if (matcher.type === 'startsWith') {
      return pathname.startsWith(matcher.href);
    }

    if (matcher.type === 'equals') {
      return pathname === matcher.href;
    }

    return false;
  }
  if (href === '/') {
    return pathname === '/';
  }
  if (pathname === '/smart-review-tool') {
    return href === '/dynamic-review'
  }

  return pathname.startsWith(href);

  return pathname === href;
}
