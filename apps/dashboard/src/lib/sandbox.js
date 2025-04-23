export const isSandboxPage = (window) => {
  return window.location.hostname === 'sandbox.handit.ai' || window.location.hostname === 'try.handit.ai';
}