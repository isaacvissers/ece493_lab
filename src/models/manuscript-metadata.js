function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createManuscriptMetadata(submissionId, values) {
  return {
    id: generateId('meta'),
    submissionId,
    authorNames: values.authorNames,
    affiliations: values.affiliations,
    contactEmail: values.contactEmail,
    abstract: values.abstract,
    keywords: values.keywords,
    mainSource: values.mainSource,
    updatedAt: new Date().toISOString(),
  };
}
