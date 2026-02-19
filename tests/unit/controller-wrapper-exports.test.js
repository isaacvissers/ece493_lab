import {
  createReviewNotificationController,
  __reviewNotificationControllerModule,
} from '../../src/controllers/reviewNotificationController.js';
import {
  createReviewSubmitController,
  __reviewSubmitControllerModule,
} from '../../src/controllers/reviewSubmitController.js';
import {
  createReviewValidationController,
  __reviewValidationControllerModule,
} from '../../src/controllers/reviewValidationController.js';

import { createReviewNotificationController as createReviewNotificationControllerImpl } from '../../src/controllers/review-notification-controller.js';
import { createReviewSubmitController as createReviewSubmitControllerImpl } from '../../src/controllers/review-submit-controller.js';
import { createReviewValidationController as createReviewValidationControllerImpl } from '../../src/controllers/review-validation-controller.js';

test('controller wrapper modules re-export implementations', () => {
  expect(createReviewNotificationController).toBe(createReviewNotificationControllerImpl);
  expect(createReviewSubmitController).toBe(createReviewSubmitControllerImpl);
  expect(createReviewValidationController).toBe(createReviewValidationControllerImpl);
});

test('controller wrapper modules execute', () => {
  expect(__reviewNotificationControllerModule).toBe(true);
  expect(__reviewSubmitControllerModule).toBe(true);
  expect(__reviewValidationControllerModule).toBe(true);
});
