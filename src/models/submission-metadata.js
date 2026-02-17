export function createSubmissionMetadata(values) {
  return {
    authorNames: values.authorNames,
    affiliations: values.affiliations,
    contactEmail: values.contactEmail,
    abstract: values.abstract,
    keywords: values.keywords,
    mainSource: values.mainSource,
  };
}
