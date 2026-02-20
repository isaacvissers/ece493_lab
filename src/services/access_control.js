export const accessControl = {
  isAuthor({ paper, authorId } = {}) {
    if (!paper || !authorId) {
      return false;
    }
    const authors = Array.isArray(paper.authorIds) ? paper.authorIds : [];
    return authors.includes(authorId);
  },
};
