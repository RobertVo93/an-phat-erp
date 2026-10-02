// Custom header the admin client sends on login, refresh and logout. Cross-site forms cannot send it,
// and a cross-origin fetch with it needs a CORS preflight that admin never grants.
export const AUTH_REQUEST_HEADER = "X-Admin-Auth";
export const AUTH_REQUEST_HEADER_VALUE = "1";
