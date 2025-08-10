/**
 * Returns various screen and window dimensions and other useful data.
 * Useful for responsive design and device detection.
 */
export function getScreenInfo() {
  if (typeof window === "undefined") {
    // Not in a browser environment
    return {
      width: 0,
      height: 0,
      availWidth: 0,
      availHeight: 0,
      innerWidth: 0,
      innerHeight: 0,
      outerWidth: 0,
      outerHeight: 0,
      devicePixelRatio: 1,
      orientation: undefined,
      isTouchDevice: false,
      userAgent: "",
    };
  }

  const {
    screen,
    innerWidth,
    innerHeight,
    outerWidth,
    outerHeight,
    devicePixelRatio,
    navigator,
  } = window;

  return {
    width: screen?.width ?? 0,
    height: screen?.height ?? 0,
    availWidth: screen?.availWidth ?? 0,
    availHeight: screen?.availHeight ?? 0,
    innerWidth: innerWidth ?? 0,
    innerHeight: innerHeight ?? 0,
    outerWidth: outerWidth ?? 0,
    outerHeight: outerHeight ?? 0,
    devicePixelRatio: devicePixelRatio ?? 1,
    orientation: screen?.orientation?.type ?? undefined,
    isTouchDevice:
      "ontouchstart" in window || (navigator?.maxTouchPoints ?? 0) > 0,
    userAgent: navigator?.userAgent ?? "",
  };
}

/**
 * Returns the current screen width (for convenience).
 */
export function getScreenWidth(): number {
  if (typeof window === "undefined") return 0;
  return window.innerWidth || window.screen.width || 0;
}

/**
 * Returns the current screen height (for convenience).
 */
export function getScreenHeight(): number {
  if (typeof window === "undefined") return 0;
  return window.innerHeight || window.screen.height || 0;
}
