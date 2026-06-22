// The one account used for sales demos and screenshots. Its Oggi page may
// show curated sample content; every other account only ever sees real data.
const DEMO_ACCOUNT_EMAIL = "andreadigiova09+impresaviva-test@gmail.com";

export function isDemoAccount(email: string | null | undefined): boolean {
  return (email ?? "").toLowerCase() === DEMO_ACCOUNT_EMAIL;
}
