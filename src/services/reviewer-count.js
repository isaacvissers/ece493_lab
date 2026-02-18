import { assignmentStore as defaultAssignmentStore } from './assignment-store.js';

export const reviewerCount = {
  getCountForPaper({ paperId, assignmentStore = defaultAssignmentStore } = {}) {
    const assignments = assignmentStore.getAssignments();
    return assignments.filter((assignment) => assignment && assignment.paperId === paperId).length;
  },
};
