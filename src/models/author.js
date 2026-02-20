function generateAuthorId() {
  return `author_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createAuthor({ authorId = null, email = null } = {}) {
  return {
    authorId: authorId || generateAuthorId(),
    email,
  };
}
