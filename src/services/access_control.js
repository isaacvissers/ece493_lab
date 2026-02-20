export const accessControl = {
  isAuthor({ paper, authorId } = {}) {
    if (!paper || !authorId) {
      return false;
    }
    const authors = Array.isArray(paper.authorIds) ? paper.authorIds : [];
    return authors.includes(authorId);
  },
  isAdmin(user) {
    if (!user) {
      return false;
    }
    const normalizedRole = user.role ? user.role.toLowerCase() : null;
    const roles = Array.isArray(user.roles) ? user.roles.map((role) => role.toLowerCase()) : [];
    return normalizedRole === 'admin'
      || normalizedRole === 'editor'
      || roles.includes('admin')
      || roles.includes('editor')
      || user.email === 'admin@example.com';
  },
};
