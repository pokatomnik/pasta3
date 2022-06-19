type Switcher<T> = {
  browser: () => T;
  server: () => T;
};

function isBrowser() {
  try {
    return typeof window !== undefined;
  } catch (e) {
    return false;
  }
}

export function select<T>(switcher: Switcher<T>) {
  const isBrowserEnv = isBrowser();
  return isBrowserEnv ? switcher.browser : switcher.server;
}
