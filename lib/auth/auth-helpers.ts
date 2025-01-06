export const ALLOWED_DOMAIN = "gebra.ai"

export function isAllowedEmail(email: string): boolean {
  return email.endsWith(`@${ALLOWED_DOMAIN}`)
}
