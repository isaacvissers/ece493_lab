function generateUserId() {
  return `user_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createUser({
  userId = null,
  role = 'editor',
} = {}) {
  return {
    userId: userId || generateUserId(),
    role,
  };
}
