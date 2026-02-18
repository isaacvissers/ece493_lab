import { reviewRequestStore } from './review-request-store.js';
import { createReviewRequest, isResolvedRequest } from '../models/review_request.js';
import { createAssignment } from '../models/assignment.js';
import { assignmentStore as defaultAssignmentStore } from './assignment-store.js';
import { assignmentStorage as defaultAssignmentStorage } from './assignment-storage.js';

let deliveryFailureMode = false;

function normalizeEmails(reviewerEmails) {
  return Array.isArray(reviewerEmails) ? reviewerEmails : [];
}

export const reviewRequestService = {
  setDeliveryFailureMode(enabled) {
    deliveryFailureMode = Boolean(enabled);
  },
  clear() {
    deliveryFailureMode = false;
    reviewRequestStore.reset();
  },
  getRequests() {
    return reviewRequestStore.getRequests();
  },
  sendReviewRequests({ paperId, reviewerEmails } = {}) {
    const sent = [];
    const failed = [];
    const emails = normalizeEmails(reviewerEmails);

    emails.forEach((email) => {
      const pendingAssignment = createAssignment({ paperId, reviewerEmail: email, status: 'pending' });
      const requestStatus = deliveryFailureMode ? 'failed' : 'sent';
      const request = createReviewRequest({
        assignmentId: pendingAssignment.assignmentId,
        paperId,
        reviewerEmail: email,
        status: requestStatus,
      });

      try {
        const stored = reviewRequestStore.addRequest(request);
        if (requestStatus === 'failed') {
          failed.push({ email, reason: 'delivery_failed', request: stored });
        } else {
          sent.push(stored);
        }
      } catch (error) {
        const reason = error && error.message ? error.message : 'request_failed';
        failed.push({ email, reason });
      }
    });

    return { sent, failed };
  },
  respondToRequest(
    requestId,
    decision,
    {
      assignmentStore = defaultAssignmentStore,
      assignmentStorage = defaultAssignmentStorage,
    } = {},
  ) {
    const request = reviewRequestStore.getRequest(requestId);
    if (!request) {
      return { ok: false, reason: 'not_found' };
    }
    if (isResolvedRequest(request)) {
      return { ok: false, reason: 'already_resolved' };
    }
    if (request.status === 'failed') {
      return { ok: false, reason: 'delivery_failed' };
    }
    if (decision !== 'accept' && decision !== 'reject') {
      return { ok: false, reason: 'invalid_decision' };
    }

    if (decision === 'reject') {
      const updated = reviewRequestStore.updateRequest({
        ...request,
        decision: 'reject',
        respondedAt: new Date().toISOString(),
      });
      return { ok: true, decision: 'reject', request: updated };
    }

    const assignment = createAssignment({
      id: request.assignmentId,
      paperId: request.paperId,
      reviewerEmail: request.reviewerEmail,
      status: 'active',
    });

    try {
      assignmentStore.addAssignment(assignment);
    } catch (error) {
      return { ok: false, reason: error && error.message ? error.message : 'assignment_failed' };
    }

    const paper = assignmentStorage.getPaper(request.paperId);
    if (!paper) {
      assignmentStore.removeAssignments({ paperId: request.paperId, reviewerEmails: [request.reviewerEmail] });
      return { ok: false, reason: 'paper_not_found' };
    }

    const currentEmails = Array.isArray(paper.assignedRefereeEmails) ? paper.assignedRefereeEmails : [];
    const nextEmails = currentEmails.includes(request.reviewerEmail)
      ? currentEmails.slice()
      : currentEmails.concat(request.reviewerEmail);

    try {
      assignmentStorage.saveAssignments({
        paperId: paper.id,
        refereeEmails: nextEmails,
        expectedVersion: paper.assignmentVersion || 0,
      });
    } catch (error) {
      assignmentStore.removeAssignments({ paperId: request.paperId, reviewerEmails: [request.reviewerEmail] });
      return { ok: false, reason: error && error.message ? error.message : 'paper_update_failed' };
    }

    const updated = reviewRequestStore.updateRequest({
      ...request,
      decision: 'accept',
      respondedAt: new Date().toISOString(),
    });
    return { ok: true, decision: 'accept', request: updated, assignment };
  },
};
