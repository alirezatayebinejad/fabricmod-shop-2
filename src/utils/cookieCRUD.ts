//use these utils to manipulate the cookies in client side and it is not working on serverside

// Helper function to check if we're on HTTPS
function isSecureContext(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.protocol === "https:";
}

export function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue ? decodeURIComponent(cookieValue) : undefined;
  }
  return undefined;
}

export function setCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; expires=${expires}; path=/; SameSite=Strict; ${isSecureContext() ? "Secure" : ""};`;
}

export function updateCookie(name: string, value: string, days: number): void {
  setCookie(name, value, days);
}

export function deleteCookie(name: string): void {
  document.cookie = `${name}=; Max-Age=-99999999; path=/; SameSite=Strict; ${isSecureContext() ? "Secure" : ""};`;
}
