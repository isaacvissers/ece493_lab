export function findAccountByCredentials({ email, password }, storage) {
  const normalizedEmail = storage.normalizeEmail(email);
  const account = storage.findByEmail(normalizedEmail);
  if (!account) {
    return null;
  }
  if (account.password !== password) {
    return null;
  }
  return account;
}
